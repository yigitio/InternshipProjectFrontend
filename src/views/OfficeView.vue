<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import apiClient from '@/utils/apiClients';

// Frontend'de kullanacağımız tip tanımı.
// Bu, backend'deki OfficeResponse DTO'su ile birebir aynı yapıda.
interface Office {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  transportDetails: string;
}

const officeInfo = ref<Office | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// MSAL'dan hem "accounts" hem de asıl işlem gücü olan "instance"ı alıyoruz
const { instance, accounts } = useMsal();

onMounted(async () => {
  try {
    if (accounts.value.length === 0) {
      throw new Error('Kullanıcı girişi yapılmamış.');
    }

    // 1. ADIM: Microsoft Graph API için Access Token Al
    const account = accounts.value[0];
    const tokenResponse = await instance
      .acquireTokenSilent({
        scopes: ['User.Read'],
        account: account,
      })
      .catch(async e => {
        if (e instanceof InteractionRequiredAuthError) {
          return await instance.acquireTokenPopup({ scopes: ['User.Read'] });
        }
        throw e;
      });

    if (!tokenResponse) {
      throw new Error('Access Token alınamadı.');
    }

    // 2. ADIM: Access Token ile Graph API'ye İstek At
    const graphResponse = await apiClient.get(
      'https://graph.microsoft.com/v1.0/me?$select=officeLocation,streetAddress',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      }
    );

    const userOfficeLocation = graphResponse.data.officeLocation;
    const userStreetAddress = graphResponse.data.streetAddress;

    if (!userOfficeLocation || !userStreetAddress) {
      throw new Error('Azure AD kullanıcı profilinde ofis bilgisi bulunamadı.');
    }

    // 3. ADIM: Kendi Backend'imize İstek Atarak Ofis Detaylarını Al
    const officeDetailsResponse = await apiClient.get<Office>(
      `/api/offices/by-name/${userOfficeLocation}`
    );

    // 4. ADIM: Ekranda göstermek için veriyi reaktif değişkene ata
    officeInfo.value = {
      ...officeDetailsResponse.data,
      name: userOfficeLocation,
      address: userStreetAddress,
    };
  } catch (err: any) {
    console.error('Ofis bilgileri alınırken hata oluştu:', err);
    error.value =
      'Ofis bilgileri yüklenemedi. Lütfen sistem yöneticinizle görüşün veya daha sonra tekrar deneyin.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="office-container">
    <div v-if="isLoading" class="state-message">
      Ofis bilgileri yükleniyor...
    </div>
    <div v-else-if="error" class="state-message error-message">{{ error }}</div>

    <div v-else-if="officeInfo" class="office-card">
      <h2>📍 {{ officeInfo.name }} Ofisi Bilgileri</h2>
      <div class="info-item">
        <strong>Adres:</strong>
        <p>{{ officeInfo.address }}</p>
      </div>
      <div class="info-item">
        <strong>Telefon:</strong>
        <p>{{ officeInfo.phoneNumber }}</p>
      </div>
      <div class="info-item">
        <strong>Ulaşım:</strong>
        <p>{{ officeInfo.transportDetails }}</p>
      </div>
    </div>

    <div v-else class="state-message">Ofis bilgileri bulunamadı.</div>
  </div>
</template>

<style scoped>
.office-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background-color: #f4f7f9;
}
.office-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
h2 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
}
.info-item {
  margin-bottom: 1.5rem;
}
.info-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-size: 1rem;
  font-weight: 500;
}
.info-item p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}
.state-message {
  font-size: 1.2rem;
  color: #7f8c8d;
}
.error-message {
  color: #e74c3c;
}
</style>
