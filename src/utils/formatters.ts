// src/utils/formatters.ts

/**
 * Verilen tarih string'ini 'gg.aa.yyyy' formatına çevirir.
 * @param dateString - 'YYYY-MM-DD' gibi bir tarih formatı.
 * @returns Formatlanmış tarih veya '-' (eğer tarih geçersizse).
 */
export const formatDate = (dateString: string | null | undefined): string => {
  // Eğer tarih string'i boş, null veya undefined ise '-' döndür.
  if (!dateString) {
    return '-';
  }

  try {
    const date = new Date(dateString);
    // Tarihin geçerli olup olmadığını kontrol et
    if (isNaN(date.getTime())) {
      return '-';
    }

    // 'tr-TR' lokalizasyonu bize doğrudan gg.aa.yyyy formatını verir.
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Geçersiz tarih formatı:', dateString, error);
    return 'Hatalı Tarih';
  }
};
