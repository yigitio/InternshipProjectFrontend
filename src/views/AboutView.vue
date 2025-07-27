<template>
  <div class="about-container">
    <h1>Hakkında</h1>
    <div class="about-content">
      <p>
        Lantern, stajyerlerin şirket içerisindeki gelişim süreçlerinin daha
        sistemli ve etkin bir şekilde izlenebilmesi amacıyla geliştirilen bir
        staj takip platformudur. Bu proje, mentor-stajyer iletişiminin yalnızca
        Teams gibi iletişim araçlarıyla sınırlı kalmasının önüne geçerek, şirket
        sistemine entegre bir yapı üzerinden takip ve geri bildirim süreçlerini
        daha verimli hale getirmeyi hedeflemektedir.
      </p>
      <p>
        Lantern, Aykut Eren, Asude Güven, Mustafa Göktuğ Yılmaz ve Yiğit Emre
        Çay’dan oluşan dört kişilik bir stajyer ekibi tarafından hayata
        geçirilmiştir. Proje süresince Erol Safa Uzun, Mert Erdoğan, Mustafa Şen
        ve Süleyman Atakan Keçeci rehberlik görevini üstlenmiş, bilgi ve
        tecrübeleriyle geliştirme sürecine yön vermiştir. Proje fikri, Erol Safa
        Uzun tarafından ortaya koyulmuş ve ekip tarafından tasarlanarak
        uygulamaya geçirilmiştir.
      </p>
      <p>
        Projenin ismi olan Lantern, bir deniz fenerinin karanlıkta yolunu arayan
        gemilere rehberlik etmesi fikrinden esinlenmiştir. Bu metafor, staj
        süreci boyunca rehberlerimizin bizlere yön gösterici rolünü sembolik
        olarak yansıtmaktadır.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  color: #242441;
  padding: 28px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 22px rgba(50, 40, 70, 0.11);
  max-height: calc(100vh - 80px); /* Ekran taşmasını engeller */
  overflow-y: auto; /* Fazla içerik olursa kaydırır ama genelde gerek kalmaz */
}

.about-container h1 {
  color: #242441;
  font-size: 26px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
}

.about-content p {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.6;
}
</style>
