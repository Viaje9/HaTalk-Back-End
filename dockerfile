# 使用官方的 Node.js 映像檔作為基礎映像檔
FROM node:16

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製專案的所有檔案到工作目錄
COPY . .

# 暴露應用程式埠號
EXPOSE 8080

# 執行應用程式
CMD ["npm", "run" ,"start"]
