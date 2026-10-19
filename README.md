# PatiNot - Kedili Not Defterim

**Web Geliştirme; Yapay Zeka** eğitimi için hazırlanmış, React tabanlı bir not alma uygulaması.

Not ekleme, listeleme, düzenleme ve silme işlemleri bulunur. Kullanıcı her not için isteğe bağlı bir kedi emojisi, kart rengi ve kategori seçebilir.

## Özellikler

- Yeni not oluşturma, notu açıp düzenleme ve onayla silme.
- İsteğe bağlı dört kedi başlığı: 😺 😸 😻 😽 veya Kedisiz.
- Krem, şeftali ve pastel mavi not kartları.
- Kişisel, Ders, Fikir ve Yapılacaklar kategorileri.
- Başlık, içerik ve kategoride Türkçe arama.
- Not sabitleme ve sabitlenenleri ayrı filtreleme.
- Son düzenleme veya başlığa göre sıralama. Sabitlenenler önceliklidir.
- “Bir pati izi keşfet”: kaydedilmiş notlardan rastgele birini açma.
- LocalStorage ile sayfa yenilendikten sonra notları koruma.
- Telefon ve masaüstü için uyarlanan görünüm.

## 1. Gerekenler

Node.js 22.12 veya üstü önerilir. Node.js 24 ile derlenmiştir.

Terminalde kontrol et:

```powershell
node --version
npm --version
```

Node.js kurulu değilse resmî https://nodejs.org/ adresinden güncel LTS sürümünü kur. Kurulumdan sonra VS Code'u kapatıp yeniden aç.

## 2. Projeyi aç

ZIP dosyasını çıkar. VS Code'da **File > Open Folder** ile `package.json` dosyasının bulunduğu `patinot` klasörünü aç.

**Terminal > New Terminal** menüsünden terminal aç. Ardından:

```powershell
npm install
npm run dev
```

Terminalde yazan yerel adresi tarayıcıda aç. Varsayılan adres `http://localhost:5173` olur; bu port doluysa terminalde başka bir adres yazabilir.

PowerShell `npm.ps1 cannot be loaded` benzeri bir hata verirse terminalin açılır menüsünden **Command Prompt** seç ve aynı komutları orada çalıştır. Alternatif olarak `npm.cmd install` ve `npm.cmd run dev` kullanabilirsin. Sistem güvenlik ayarlarını değiştirmen gerekmez.

Sunucuyu durdurmak için terminalde **Ctrl+C**.

## 3. Denenecek işlemler

1. “Yeni not” ile bir başlık ve içerik gir.
2. Kedy alanından bir emoji ve bir kart rengi seçip kaydet.
3. Notu düzenle; başlığı, kediyi ve rengi değiştir.
4. Notu sabitle; soldan Sabitlenenler görünümünü aç.
5. Arama ve kategori filtresini dene.
6. Sayfayı yenile; kaydın korunduğunu kontrol et.
7. Notu sil ve sayfayı yenile; silinmiş not geri gelmemeli.
8. Kedisiz bir not oluştur ve dar ekran görünümünü kontrol et.

İlk açılışta üç örnek not görünür. Bunlar kullanıcı verisi değildir ve düzenlenebilir/silinebilir.

## 4. Kaynak kod yapısı

| Dosya | Görevi |
| --- | --- |
| `src/App.jsx` | Ana ekran, filtreler, arama, pencere açma ve kullanıcı işlemleri |
| `src/components/NoteCard.jsx` | Tek notun kartı, kedi başlığı ve işlem butonları |
| `src/components/NoteEditor.jsx` | Not ekleme ve düzenleme formu |
| `src/components/DeleteDialog.jsx` | Silme onayı |
| `src/components/Icon.jsx` | Küçük arayüz simgeleri |
| `src/hooks/useNotes.js` | React durumu ve veri kaydetme işlemleri |
| `src/utils/notes.js` | Veri doğrulama, CRUD, arama ve LocalStorage yardımcıları |
| `src/styles.css` | Renkler, kartlar ve mobil görünüm |
| `public/cat-mascot.png` | Yapay zekâ ile üretilmiş özgün kedi maskotu |
| `tests/notes.test.js` | Veri kalıcılığı ve not işlemlerinin testleri |
| `netlify.toml` | Netlify derleme ve yayın ayarları |

## 5. Test ve derleme

```powershell
npm test
npm run build
```

Derleme sonucunda `dist` klasörü oluşur. Derlenmiş sürümü yerelde açmak için:

```powershell
npm run preview
```

Bu sürüm hazırlanırken veri testleri ve üretim derlemesi kontrol edilir. Gerçek tarayıcıdaki görsel ve etkileşim kontrolünü yukarıdaki deneme adımlarıyla yap.

## 6. GitHub ve Netlify

Kaynak kodları bir **public GitHub deposuna** yükle. `node_modules` ve `dist` klasörlerini kaynak deposuna ekleme. `.gitignore` bu klasörleri dışarıda bırakır. `package-lock.json` dosyasını yükle.

Netlify'da GitHub deposunu bağlarken:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: `24` (`netlify.toml` dosyasında tanımlı)

Netlify'daki Base directory, `package.json` dosyasının bulunduğu klasör olmalıdır. Dosyaları deponun köküne yüklersen boş bırakılır. Depoda ayrıca bir `patinot` alt klasörü varsa `patinot` seçilir.

## 7. Forma teslim

Bu eğitim için istenenler:

1. Çalışan uygulamanın **Netlify bağlantısı**.
2. Kaynak kodun bulunduğu **public GitHub bağlantısı**.
3. En az bir uygulama **ekran görüntüsü**.

Ekran görüntüsünü uygulama çalışırken kendin al. Gerekirse projede `docs` klasörü oluşturup `ekran-goruntusu.png` adıyla kaydet.

## Veri hakkında

Notlar yalnızca kullanılan tarayıcının LocalStorage alanında tutulur. Başka cihazlarla ortak bir veritabanı veya eşitleme yoktur. Tarayıcı verileri temizlenirse notlar silinir. Yerel geliştirme adresi ve Netlify adresi farklı veri alanları kullanır. Hata durumunda ekrandaki uyarıyı dikkate al.

## Özgünlük ve kaynaklar

Eğitimde verilen React/Vite ve Remix örnekleri CRUD ve bileşen ayrımı açısından incelenmiştir. Bu uygulamanın kodu PatiNot için ChatGPT desteğiyle yazılmıştır. Kedi maskotu ChatGPT görsel üretimiyle oluşturulmuştur. Kullanılmamış bir araç veya yapılmamış manuel düzenleme yapılmış gibi belirtilmemelidir.

Resmî kaynaklar:
- https://react.dev/learn
- https://vite.dev/guide/
- https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/

Referans eğitim projeleri:
- https://github.com/ylcnsonur/web-gelistirme-js-sample
- https://github.com/ylcnsonur/remix-framework-project
