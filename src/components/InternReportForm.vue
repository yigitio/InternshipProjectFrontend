<template>
  <div class="form-container">
    <h2>{{ $t('report.title') }}</h2>
    <form @submit.prevent="openConfirmation">
      <label for="file">{{ $t('report.label') }}</label>
      <input
        id="file"
        type="file"
        @change="handleFile"
        accept=".pdf,.doc,.docx"
        required
      />

      <button type="submit">{{ $t('buttons.send') }}</button>
      <p v-if="message" :class="status">{{ $t(message) }}</p>
    </form>

    <!-- MODAL -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-box">
        <h3>{{ $t('report.confirm') }}</h3>
        <div class="modal-buttons">
          <button class="confirm" @click="sendReport">
            {{ $t('report.confirmYes') }}
          </button>
          <button class="cancel" @click="showModal = false">
            {{ $t('buttons.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import { getAccessToken } from '@/utils/msalHelpers';
import apiClient from '@/utils/apiClients';

const file = ref<File | null>(null);
const mentorEmail = ref('');
const mentorName = ref('');
const message = ref('');
const status = ref<'success' | 'error'>('success');
const showModal = ref(false);

const { accounts } = useMsal();
const internEmail = accounts.value[0].username;
const internName = accounts.value[0].name;
const managerEmail = ref('');

onMounted(async () => {
  try {
    const res = await apiClient.get(
      `/api/interns/by-email?email=${internEmail}`
    );
    mentorEmail.value = res.data.mentorEmail;
    mentorName.value = res.data.mentorName || 'Mentor';
    managerEmail.value = res.data.managerEmail || '';
  } catch (e) {
    message.value = 'report.errorMentorEmail';
    status.value = 'error';
  }
});

const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;

  const selectedFile = input.files[0];
  const allowedExtensions = ['pdf', 'docx', 'doc'];
  const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    message.value = 'report.invalidFile';
    status.value = 'error';
    file.value = null;
    (document.getElementById('file') as HTMLInputElement).value = '';
    return;
  }

  file.value = selectedFile;
  message.value = '';
};

const openConfirmation = () => {
  if (!file.value || !mentorEmail.value) return;
  showModal.value = true;
};

const sendReport = async () => {
  showModal.value = false;

  try {
    const accessToken = await getAccessToken();
    const base64 = await toBase64(file.value!);

    const mailPayload = {
      message: {
        subject: `Günlük Rapor - ${internName}`,
        body: {
          contentType: 'Text',
          content: `Merhaba ${mentorName.value},\n\nStajyer ${internName} (${internEmail}) tarafından günlük staj raporu gönderildi.\n\nRapor ekte yer almaktadır.\n\nTeşekkürler,\n\nİyi çalışmalar.\n\n\n\n Bu mail Lantern uygulaması tarafından gönderilmiştir.`,
        },
        toRecipients: [
          {
            emailAddress: { address: mentorEmail.value },
          },
        ],
        ccRecipients: managerEmail.value
          ? [{ emailAddress: { address: managerEmail.value } }]
          : [],
        attachments: [
          {
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: file.value!.name,
            contentBytes: base64,
          },
        ],
      },
      saveToSentItems: true,
    };

    await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailPayload),
    });

    message.value = 'report.success';
    status.value = 'success';
    (document.getElementById('file') as HTMLInputElement).value = '';
  } catch (err) {
    console.error('Hata:', err);
    message.value = 'report.fail';
    status.value = 'error';
    (document.getElementById('file') as HTMLInputElement).value = '';
  }
};

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
</script>

<style scoped>
.form-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #555;
}
input[type='file'] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  font-size: 0.95rem;
}
button {
  margin-top: 1rem;
  padding: 12px;
  background-color: #242441;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #1e1e38;
}
.success {
  color: green;
}
.error {
  color: red;
}

/* ✅ Modal Stili */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 90%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.modal-box h3 {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: #333;
}
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.modal-buttons .confirm {
  background-color: #242441;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.modal-buttons .cancel {
  background-color: #ccc;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
