# Basit Blog Sistemi

Bu proje, Node.js'in `http`, `fs`, `path` ve `events` gibi temel çekirdek modülleri kullanılarak geliştirilmiş basit bir blog sistemidir. Proje, herhangi bir harici web framework'ü (Express.js gibi) kullanılmadan oluşturulmuştur.

## Özellikler

* Tüm blog yazılarını listeleme
* ID ile belirli bir blog yazısını görüntüleme
* Yeni blog yazısı oluşturma
* Blog verilerini `blogs/` klasöründe JSON dosyaları olarak saklama
* Yeni yazı oluşturma ve okuma gibi aktiviteleri `logs/activity.log` dosyasına kaydetme

## Kullanılan Temel Modüller

**`http`**: Web sunucusu oluşturmak ve gelen istekleri yönetmek için kullanıldı. 
**`fs` (promises)**: Blog yazılarını ve log kayıtlarını okuma/yazma gibi dosya işlemleri için asenkron olarak kullanıldı. 
**`path`**: Farklı işletim sistemleriyle uyumlu, güvenli dosya yolları oluşturmak için kullanıldı. 
**`events`**: Blog oluşturma ve okunma gibi olayları takip ederek loglama sistemini tetiklemek için kullanıldı. 

## Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Projeyi klonlayın:**
    ```bash
    git clone <https://github.com/EnessCansever/basit-blog-sistemi>
    ```

2.  **Proje dizinine gidin:**
    ```bash
    cd blog-sistemi
    ```

3.  **Sunucuyu başlatın:**
    ```bash
    node index.js
    ```
    Sunucu başlatıldığında konsolda `Sunucu çalışıyor: http://localhost:3000` mesajını göreceksiniz.

## API Kullanımı

Sunucu çalışırken aşağıdaki `endpoint`'leri kullanarak blog sistemini yönetebilirsiniz.

### 1. Tüm Blogları Listeleme

Tüm blog yazılarını bir JSON dizisi olarak döndürür.

* **Endpoint:** `GET /blogs`
* **Örnek İstek:**
    ```bash
    curl http://localhost:3000/blogs
    ```

### 2. Belirli Bir Blog Yazısını Görüntüleme

Verilen `:id` ile eşleşen blog yazısını döndürür.

* **Endpoint:** `GET /blog/:id`
* **Örnek İstek:**
    ```bash
    curl http://localhost:3000/blog/1
    ```

### 3. Yeni Blog Yazısı Oluşturma

İstek gövdesinde gönderilen `title` ve `content` bilgileriyle yeni bir blog yazısı oluşturur.

* **Endpoint:** `POST /create`
* **Örnek İstek:**
    ```bash
    curl -X POST http://localhost:3000/create \
    -H "Content-Type: application/json" \
    -d '{"title":"Yeni Blog Başlığı", "content": "Bu benim yeni blog yazımın içeriğidir."}'
    ```