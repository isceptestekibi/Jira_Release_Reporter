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
- **v2.6.2:** Jira filtre ekranında Export butonunun kaybolması ihtimaline karşı arayüze ve PRD dokümanına doğrudan CSV indirme bağlantıları bilgilendirmesi eklendi.
- **v2.6.3:** Excel ve CSV yüklemelerinde, biletlerin içindeki Android ilişiği/bağlantısı (relates) nedeniyle platformun yanlışlıkla ANDROID olarak tespit edilmesi hatası giderildi. `Issue key` ve `Key` alanları `originalKey` atamasında önceliklendirildi.
- **v2.6.4:** Versiyon ve tarih etiketlerinin derleme/dağıtım öncesi güncellenmesi kuralı PRD dokümanına eklendi ve sürüm numarası güncellendi.
- **v2.8.0 (Güncel):** Rapor ekranında tam düzenleme ve müşteriye giden ID kuralı:
  - **Tablolar artık yerinde düzenlenebilir.** Talepler ve Tamamlanan Kayıtlar tablolarındaki **ID, Epic Name ve Açıklama** hücrelerine tıklayıp doğrudan yazı düzeltilebilir. Epic adı düzenlendiğinde, birleştirilmiş hücredeki tüm satırlar birlikte güncellenir (gruplama bozulmaz). Yapılan tüm düzenlemeler mail ve PDF çıktısına aynen yansır.
  - **Satır çıkarma eklendi.** Her satırın sonundaki `×` düğmesi o kaydı rapordan çıkarır; çıkarılan kayıtlar ekranda, mailde ve PDF'te görünmez. Üstteki bilgi çubuğundan "Tümünü geri al" ile geri alınabilir. `×` düğmeleri PDF ve yazdırma çıktısında görünmez.
  - **Defect ID artık yalnızca CCRSP gösteriyor (kritik).** Müşterinin `ISCEPEXTRC` / `ISCOREXT` kayıtlarına erişimi olmadığı hâlde, CCRSP'si olmayan hatalarda bu numaralar müşteriye gönderilen tabloya yazılıyordu. Artık CCRSP yoksa `-` konur. Ekranın altındaki iç "Tarih Bazlı Filtrele" tablosunda kaydı teşhis edebilmek için tam ID görünmeye devam eder.
  - Düzenlemeler ve satır çıkarmalar kaydın kendi bilet numarasına bağlıdır; tarih filtresi sıralamayı değiştirdiğinde kayma olmaz.
- **v2.8.1 (Güncel):** **CCRSP artık bağlı kayıt üzerinden de bulunuyor.** Bir hatanın CCRSP'si her zaman kendi üstünde durmuyor; bazen bağlı olduğu kaydın (ör. ilgili Story) üstünde oluyor ve bu durumda Defect ID boş kalıyordu. Artık kaydın kendi CCRSP'si yoksa bağlantılarına bakılıyor: bağlantı doğrudan bir CCRSP ise o, bağlı kayıt aynı export içindeyse onun CCRSP'si kullanılıyor. Gerçek örnek: `ISCEPANDROID-16142` → bağlı `ISCEPANDROID-15940` → **CCRSP-3529**. Yalnızca tek adım gidilir (zincir takip edilmez), böylece sonuç her çalıştırmada aynıdır. Hiçbir şekilde CCRSP bulunamazsa alan `-` kalır; ISCEPEXTRC/ISCOREXT asla yazılmaz. Kural `services/ccrspResolver.ts` içinde tek noktada tanımlıdır ve `npm run test:parser` ile test altındadır.
- **v2.7.1:** Rapor düzeni değişikliği — **Kısım B (Sürüm Detayları: Belirtilmesi Gerekenler + Bilinen Durumlar)** artık Talepler/Tamamlanan Kayıtlar tablolarının altında değil, **Kısım A'nın hemen altında, tabloların üstünde** yer alıyor. Böylece müşteri önce proje/paket bilgisini, ardından belirtilmesi gerekenleri, sonra task listelerini görüyor. Değişiklik hem ekran/PDF çıktısına hem de "Mail için Kopyala" çıktısına uygulandı.
- **v2.7.0:** Doğruluk ve kararlılık düzeltmeleri:
  - **Bug sınıflandırma hatası giderildi (kritik).** Kayıt satırının tamamında "bug" veya "external" kelimesi arandığı için, özetinde bu kelimeler geçen Story/Task kayıtları yanlışlıkla "Tamamlanan Kayıtlar" tablosuna düşüyordu. Arama artık PRD Kural B'ye uygun şekilde **yalnızca Labels (Etiketler) kolonunda** yapılmaktadır. Bu kural `npm run test:parser` ile otomatik test altına alınmıştır.
  - **Düzenlenen hata açıklamalarının kayması giderildi.** Açıklamalar satır sırasına göre saklandığı için tarih filtresi uygulandığında yazılan metin başka bir kaydın satırına geçebiliyordu; artık kaydın kendi bilet numarasına bağlı tutulmaktadır.
  - **Platform artık elle değiştirilebilir.** Bilet anahtarlarından platform tespit edilemediğinde sistem sessizce "IOS" yazıyordu. Artık uyarı gösterilmekte ve Kısım A'daki Platform alanı açılır listeden seçilebilmektedir.
  - **"Mail için Kopyala" hataları artık görünür.** Panoya yazma başarısız olduğunda kullanıcı hiçbir uyarı almıyor, kopyalandığını sanıyordu. Ayrıca düz metin (text/plain) karşılığı da panoya yazılmaktadır. Aynı şekilde PDF hataları da rapor ekranında gösterilmektedir.
  - Rapor başlıklarındaki `<`, `>`, `&` karakterleri mail çıktısında kaçırılarak tablo bozulması engellendi.
  - Sayısal (gg/aa/yyyy) tarih formatları ayrıştırılabilir hale getirildi; daha önce ayrıştırılamayan tarihler kaydın yanlışlıkla gri gösterilmesine yol açıyordu.
  - Arayüzdeki "AND: CSV İndir" bağlantısı IOS filtresine (18442) gidiyordu; Android filtresine (18441) yönlendirildi.
  - Depo temizliği: `.gitignore` eklendi, `node_modules/` ve `dist/` takipten çıkarıldı, `.env.example` eklendi, README yeniden yazıldı.

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

## 7. Canlıya Dağıtım (Deployment) ve Versiyonlama Kılavuzu

Uygulamada herhangi bir geliştirme veya hata giderme yapıldıktan sonra canlıya çıkış öncesinde aşağıdaki adımların eksiksiz olarak yapılması zorunludur:

1. **Versiyon ve Tarih Değerlerinin Güncellenmesi**:
   - `version.ts` dosyası içindeki `APP_VERSION` (örn: `2.6.4`) ve `APP_DATE` (örn: `05062026`) değişkenleri güncellenmelidir.
   - Bu değerler uygulama arayüzünün sağ alt köşesinde yer alan versiyon etiketine otomatik olarak yansıtılmaktadır.

2. **PRD (Ürün Gereksinimleri Belgesi) Güncellenmesi**:
   - `PRD.md` dosyasındaki "5. Proje Ortamı & Versiyonlar" kısmına yeni sürüm maddesi eklenmeli ve `(Güncel)` ibaresi en son sürümün yanına konulmalıdır.

3. **Yerel Derleme (Build) ve Test Kontrolü**:
   - Değişikliklerin hatasız şekilde paketlendiğini doğrulamak için `npm run build` komutu çalıştırılmalıdır.
   - `npm run dev` ile yerel sunucu başlatılarak arayüzdeki sürüm etiketinin doğruluğu yerelde test edilmelidir.

4. **Canlıya Dağıtım (Publish)**:
   - Git commit ve push işlemlerinin ardından, `npm run deploy` komutu çalıştırılarak güncel derleme dosyaları GitHub Pages (`gh-pages`) dalına yüklenmelidir. Tarayıcı önbelleği temizlenerek canlıda test edilmelidir.
