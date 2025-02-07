# ChatApp Projesi

Bu proje, **ChatApp** adlı bir sohbet uygulamasının hem **Backend** hem de **Frontend** kısmını içeriyor. **Backend** tarafı Node.js ile yazılmış, **Frontend** tarafı ise React ve Vite kullanarak oluşturulmuştur.

## Proje Yapısı

- **Backend**: Express.js ve WebSocket ile geliştirilmiştir. PostgreSQL veritabanı kullanır.
- **Frontend**: React ve Vite kullanılarak oluşturulmuştur. WebSocket ile sunucuya bağlanır.

## Backend Kurulumu ve Çalıştırma

1. **Backend Klasörüne Git**:
   ```sh
   cd backend
   ```
2. **Bağımlılıkları Yükle**:
   ```sh
   npm install
   ```
4. **Gerekli Ortam Değişkenlerini Tanımla**:
   `.env` dosyanızı oluşturun ve aşağıdaki değerleri girin: yada kendi değerlerinizi girin
   ```ini
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=chatdb
   DB_PASS=12345
   DB_PORT=5432
   PORT=5000
   WS_PORT=8080
   ```
5. **Backend'i Çalıştır**:
   ```sh
   npm run dev
   ```

## Frontend Kurulumu ve Çalıştırma

1. **Frontend Klasörüne Git**:
   ```sh
   cd frontend
   ```
2. **Bağımlılıkları Yükle**:
   ```sh
   npm install
   ```
 3.  **Chat klasörüne Git**
   ```sh
   cd chat
   ```
 4.**Bağımlılıkları Yükle**:
   ```sh
   npm install
   ```
   
5 **Frontend'i Çalıştır (chat klasöründe)**:
   ```sh
   npm run dev
   ```

🚀 Ardından, **http://localhost:5173** adresinden projeyi görüntüleyebilirsiniz. İyi Kodlamalar



