# Ürün Gereksinimleri Belgesi (PRD) - Jira Release Reporter

*(Yeni Kurumsal Organizasyon: isceptestekibi)*

## 1. Uygulama Ne İşe Yarar? (Ürün Özeti)
**Jira Release Reporter**, Jira'dan dışa aktarılan (HTML veya Excel formatlı) karmaşık issue listelerini anında okunabilir, kurumsal şablona uygun ve Outlook/Mac Mail ile uyumlu **Sürüm Notları (Release Notes)** formatına dönüştürür.

Ekibin raporları manuel oluşturma, kopyala-yapıştır yapma ve platform/ID tespit etme gibi el yordamıyla yaptığı işleri otomatikleştirerek zaman kazandırır ve hata riskini sıfırlar.

## 2. Sistem Nasıl Çalışır ve Verileri Nasıl Sınıflandırır?
Ekibin bilmesi gereken en temel "veriyi nasıl okuyoruz?" kuralları aşağıdaki gibidir:

### A. Talepler (Story & Task) Nasıl Belirlenir?
- **Kimler Buraya Girer?** Kayıt türü "Bug" olmayan tüm işler (Story, Task, vb.).
- **Nasıl Gösterilir?** Talebin bir CCRSP numarası varsa o numara Tabloya yazılır. Yoksa "-" işareti konularak "Talepler" tablosuna eklenir.

### B. Hatalar (Bugs) Nasıl Belirlenir ve Seçilir?
- **Kimler Buraya Girer?**
  1. Jira'da Issue Type'ı (Kayıt Türü) "Bug" olanlar.
  2. İçinde/Etiketinde `external` veya `accessibilitybug` geçenler.
  3. Dış sistem (Örnek: `ISCEPEXTRC`) bağlantısı olanlar.
- **Hata (Defect) ID Nasıl Atanır?** (En Önemli Kural)
  1. Sistem metin içinde **"CCRSP"** arar. Varsa, Hata ID'yi bu yapar ve tablodaki başlığı da otomatik olarak o CCRSP'nin kendi başlığı ile günceller (Çapraz eşleşme).
  2. CCRSP bulamazsa, metindeki **"ISCEPEXTRC"** veya **"ISCOREXT"** numarasını bulur ve ID olarak bunu atar.
  3. Hiçbiri yoksa ID hücresine "-" yazar.

### C. Geliştirme Platformu (iOS / Android) Nasıl Bulunur?
- Bilet numarasındaki isme (Örneğin: `ISCEPANDROID-1234` veya `ISCEPIPHONE-5678`) bakılır. "ANDROID" veya "IPHONE" geçmesine göre platform sütununa otomatik "iOS" veya "Android" yazılır.

### D. Destanlar (Epic) Nasıl Gruplanır?
- Jira listesindeki "Epic Name" alanlarına bakılır. Aynı Epic altındaki kayıtlar tespit edilir ve tabloda ortak bir ana başlık altında birleştirilir. Tablo sade bir görünüme kavuşur.

### E. Ekrandaki Sürüm Notları (Belirtilmesi Gerekenler) Nasıl Doldurulur?
- **Nereden Okunur?** Jira'daki hesaplanan alanlardan (Örn: `customfield_10082` veya "Sürüm Notu" kolonu).
- **Teknik Veriyi Temizleme:** Başında `#` işareti olan tüm maddeler "teknik geliştirici/test notu" olarak algılanır ve Sürüm Notu listesine eklenmez, filtrelenir (silinir).
- Rapora, Task özeti koyu (bold), Sürüm Notu ise normal yazı tipiyle yansıtılır. Gerekirse rapor ekranından manuel olarak silinebilir/düzenlenebilir.

## 3. Ekran Özellikleri ve Kullanım Kolaylıkları

- **Daha Önce Çözülmüş İşleri Gizleme (Tarih Filtresi):** Arayüzde bir tarih seçildiğinde, o tarihten önce tamamlanmış (Resolved) olan işler soluk/gri renkte gösterilir. Bu eklenti, ekibin daha önce test edip kapattığı işler için tekrar tekrar test eforu harcamasını engeller.
- **Ekranda Düzenleme (Editable Alanlar):** Liste oluşturulduktan sonra bile her yere müdahale edebilirsiniz! Ekrandaki aşağıdaki alanlara tıklayıp klavyeden düzeltebilirsiniz:
  - Sürüm Numarası (Kısım A)
  - Tüm hata açıklamaları satırları (textarea ile güvenli düzenleme)
  - Belirtilmesi Gerekenler notları
  - Bilinen Durumlar (Manuel yazı ekleyebilirsiniz)
  - Paket Linkini belirten uyarı metni

## 4. Raporu Dışa Aktarma (Export) Seçenekleri

- **Mail İçin Kopyala:** Tıkladığınızda, ekrandaki her şeyi renk, tablo genişliği ve formatı bozulmadan belleğe kopyalar. Outlook veya Mac Mail'e "Yapıştır" (Cmd+V / Ctrl+V) dediğinizde mükemmel görünür.
- **PDF İndir:** Sayfayı anlık renkleri ve görselleriyle birlikte ekibe veya yönetime sunulabilecek derli toplu bir A4/PDF çıktısı olarak kaydeder.

## 5. Proje Ortamı & Versiyonlar

*Proje kodları GitHub üzerinde `isceptestekibi/Jira_Release_Reporter` reposunda tutulmaktadır.*
**Canlı Uygulama Adresi:** [https://isceptestekibi.github.io/Jira_Release_Reporter/](https://isceptestekibi.github.io/Jira_Release_Reporter/)

**Son Versiyon Geçmişi:**
- **v2.5.0 - v2.5.2:** Release Notes (Sürüm notu) kolonundan otomatik doldurma yeteneği ve teknik notları (`#`) silme özelliği geliştirildi. Bilinen durumlar editable yapıldı.
- **v2.5.3 - v2.5.4:** HTML tag'leri ve liste/bullet yapıları korunarak rapora yansıma sağlandı.
- **v2.5.5 - v2.5.7:** En önemli eşleşme kuralları eklendi: CCRSP ID ataması netleştirildi, hata başlığının doğrudan CCRSP özetiyle üstüne yazdırılması yeteneği kazandırıldı. Satıra sığmama sorunları word-wrap ile giderildi.
- **v2.5.8:** Arayüze "Filter export alınmalı" yönlendirme uyarıları eklendi.
- **v2.5.9:** Rapor alanına tıklandığında uygulamanın çökmesi (React 19 white-screen) engellendi, satır içi metin düzenleme kutuları (auto-resizing textarea) güvenli hale getirildi.
- **v2.6.0:** Github organizasyon taşınması gerçekleştirildi (`isceptestekibi`). PRD dokümanı tüm ekipler için daha sade ve anlaşılan kurallar rehberi olarak yeniden yazıldı.
- **v2.6.1:** "Change Request" ve türevi olan `Bug` dışındaki tüm kayıtların, bağlantılı CCRSP'si olmasa dahi "Talepler" tablosunda (`-` şeklinde) eksiksiz yer alması kuralı eklendi. Bilgilendirme ikon metninin turuncu CSS sınıfı güncellendi ve Vite altyapısı yeni repo url formatı (`/Jira_Release_Reporter/`) ile uyumlu hale getirildi.
- **v2.6.2 (Güncel):** Jira filtre ekranında Export butonunun kaybolması ihtimaline karşı arayüze ve PRD dokümanına doğrudan CSV indirme bağlantıları bilgilendirmesi eklendi.

## 6. Referans JQL Filtreleri

İleride kaybolma riskine karşı, mobil test ekibinin kullandığı standart Jira JQL filtreleri aşağıda referans olarak listelenmiştir. Raporu oluşturmak için Jira'da bu filtreleri kullanıp dışa aktarabilirsiniz. 

### ANDROID (ISCEPANDROID) Filtresi
```jql
project = ISCEPANDROID AND fixVersion = 10.10.0
AND status = Approved AND (issuetype IN (Story, "Change Request",Improvement,Task)
OR (  issuetype = Bug  AND labels IN 
(external, External,External-RC,External_UAT,External-UAT,External-PROD,External_Live,External-RC-BoarddaYok,External-UAT-BoarddaYok,External-PROD-BoarddaYok)))
AND assignee in ( 62f0f407da8620d533941d49, 6079e03c53cc020069bdb56a, 62f0f38e1323922c61e357ea , 712020:83d9fe14-ecf6-4562-ae39-9a8d58f1d10e,712020:9bbadc7a-ce11-4ba2-9aa1-3a27a59ff9a1,712020:5a789138-8ec9-46a4-b5af-d386c54d614a, 712020:ead50a8a-bd09-4280-a3b3-2895160ae799,712020:21df12ad-c2b9-4d78-ab19-6ec5c1bae8fe,712020:081e7c39-2f27-4707-b312-a4316617d9fa)
ORDER BY statusCategoryChangedDate DESC, fixVersion ASC, updated DESC, issuetype DESC
```

### IOS (ISCEPIPHONE) Filtresi
```jql
project = ISCEPIPHONE AND fixVersion = 10.10.0
AND status = Approved AND (issuetype IN (Story, "Change Request",Improvement,Task)
OR (  issuetype = Bug  AND labels IN 
(external, External,External-RC,External_UAT,External-UAT,External-PROD,External_Live,External-RC-BoarddaYok,External-UAT-BoarddaYok,External-PROD-BoarddaYok)))
AND assignee in ( 62f0f407da8620d533941d49, 6079e03c53cc020069bdb56a, 62f0f38e1323922c61e357ea , 712020:83d9fe14-ecf6-4562-ae39-9a8d58f1d10e,712020:9bbadc7a-ce11-4ba2-9aa1-3a27a59ff9a1,712020:5a789138-8ec9-46a4-b5af-d386c54d614a, 712020:ead50a8a-bd09-4280-a3b3-2895160ae799,712020:21df12ad-c2b9-4d78-ab19-6ec5c1bae8fe,712020:081e7c39-2f27-4707-b312-a4316617d9fa,5b6834dfee2c923be1c74957)
ORDER BY statusCategoryChangedDate DESC, fixVersion ASC, updated DESC, issuetype DESC
```

### Alternatif: Doğrudan CSV İndirme Bağlantıları

Bazen Jira filtre ekranlarında dışa aktarma (Export) butonu geçici olarak kaybolabilmektedir. Bu durumda HTML yerine doğrudan tüm alanları içeren CSV formatında indirme yapabilmeniz için aşağıdaki acil durum kısayollarını kullanabilirsiniz. 
*(Not: İndirme hatası gelirse açılan Jira sayfasındaki "Retry Operation" butonuna tıklayarak CSV indirmesini zorlayabilirsiniz.)*

- **ANDROID CSV Export Linki:** [İndir (filter=18441)](https://commencis.atlassian.net/sr/jira.issueviews:searchrequest-csv-all-fields/temp/SearchRequest.csv?jqlQuery=filter=18441)
- **IOS CSV Export Linki:** [İndir (filter=18442)](https://commencis.atlassian.net/sr/jira.issueviews:searchrequest-csv-all-fields/temp/SearchRequest.csv?jqlQuery=filter=18442)
