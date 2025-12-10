# Guía de Despliegue en VPS

Esta guía te ayudará a configurar el despliegue automático de tu resume desde GitHub Actions a tu VPS.

## Requisitos Previos

- Un VPS con acceso SSH
- Un servidor web instalado (Nginx o Apache)
- Node.js instalado en el VPS (opcional, solo si necesitas SSR)
- Dominio configurado apuntando a tu VPS (opcional)

## Paso 1: Configurar el VPS

### 1.1 Instalar Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### 1.2 Crear directorio de despliegue

```bash
# Crea el directorio donde se desplegará el sitio
sudo mkdir -p /var/www/resume
sudo chown -R $USER:$USER /var/www/resume
```

### 1.3 Configurar Nginx

Crea un archivo de configuración para tu sitio:

```bash
sudo nano /etc/nginx/sites-available/resume
```

Agrega la siguiente configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com; # Reemplaza con tu dominio
    
    root /var/www/resume;
    index index.html;

    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache para archivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Si no tienes dominio, usa la IP de tu servidor:

```nginx
server {
    listen 80;
    server_name tu-ip-publica; # Ejemplo: 192.168.1.100
    
    root /var/www/resume;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 1.4 Habilitar el sitio

Después de crear el archivo de configuración, necesitas habilitarlo creando un enlace simbólico:

```bash
# Crear enlace simbólico desde sites-available a sites-enabled
# Esto "activa" la configuración del sitio
sudo ln -s /etc/nginx/sites-available/resume /etc/nginx/sites-enabled/

# Verificar que el enlace se creó correctamente
ls -la /etc/nginx/sites-enabled/ | grep resume
# Deberías ver algo como: resume -> /etc/nginx/sites-available/resume

# Verificar que la configuración de Nginx es válida (sin errores)
sudo nginx -t
# Si todo está bien, verás: "nginx: configuration file /etc/nginx/nginx.conf test is successful"

# Si hay errores, corrígelos antes de continuar

# Reiniciar Nginx para aplicar los cambios
sudo systemctl restart nginx

# Verificar que Nginx está corriendo correctamente
sudo systemctl status nginx
# Deberías ver "active (running)" en verde
```

**Nota importante**: Si estás usando una distribución que no tiene la estructura `sites-available/sites-enabled` (como algunas versiones de CentOS), puedes agregar la configuración directamente en `/etc/nginx/conf.d/resume.conf` y luego reiniciar Nginx.

### 1.5 Configurar firewall (si es necesario)

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Paso 2: Configurar SSH en el VPS

### 2.1 Crear usuario para despliegue (opcional pero recomendado)

```bash
# Crear usuario
sudo adduser deploy

# Agregar a grupo sudo (opcional)
sudo usermod -aG sudo deploy

# Cambiar al usuario deploy
su - deploy
```

### 2.2 Configurar clave SSH

```bash
# En el VPS, crear directorio .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Crear archivo authorized_keys
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Paso 3: Generar clave SSH para GitHub Actions

### 3.1 Generar clave SSH en tu máquina local

```bash
# Generar nueva clave SSH (sin passphrase para CI/CD)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy -N ""

# Esto creará dos archivos:
# ~/.ssh/github_actions_deploy (clave privada)
# ~/.ssh/github_actions_deploy.pub (clave pública)
```

### 3.2 Copiar clave pública al VPS

```bash
# Copiar la clave pública al VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub usuario@tu-vps-ip

# O manualmente:
cat ~/.ssh/github_actions_deploy.pub | ssh usuario@tu-vps-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3.3 Probar conexión SSH

```bash
ssh -i ~/.ssh/github_actions_deploy usuario@tu-vps-ip
```

## Paso 4: Configurar Secrets en GitHub

### 4.1 Ir a tu repositorio en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**

### 4.2 Agregar los siguientes secrets:

#### `VPS_SSH_KEY`
- **Valor**: Contenido completo del archivo `~/.ssh/github_actions_deploy` (clave privada)
- **Cómo obtenerlo**: 
  ```bash
  cat ~/.ssh/github_actions_deploy
  ```
- Copia TODO el contenido incluyendo `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`

#### `VPS_HOST`
- **Valor**: IP o dominio de tu VPS
- **Ejemplo**: `192.168.1.100` o `resume.tudominio.com`

#### `VPS_USER`
- **Valor**: Usuario SSH del VPS
- **Ejemplo**: `deploy` o `root`

#### `VPS_PORT`
- **Valor**: Puerto SSH (generalmente 22)
- **Ejemplo**: `22`

#### `VPS_DEPLOY_PATH`
- **Valor**: Ruta donde se desplegará el sitio
- **Ejemplo**: `/var/www/resume`

## Paso 5: Verificar el Despliegue

### 5.1 Hacer push a main

```bash
git add .
git commit -m "Configure GitHub Actions deployment"
git push origin main
```

### 5.2 Verificar el workflow

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Deberías ver el workflow ejecutándose
4. Click en el workflow para ver los logs

### 5.3 Verificar el sitio

Abre tu navegador y visita:
- `http://tu-dominio.com` o
- `http://tu-ip-publica`

## Paso 6: Configurar HTTPS (Opcional pero Recomendado)

### 6.1 Instalar Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### 6.2 Obtener certificado SSL

```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### 6.3 Renovación automática

Certbot configura automáticamente la renovación. Puedes verificar con:

```bash
sudo certbot renew --dry-run
```

## Solución de Problemas

### Error: Permission denied (publickey)

- Verifica que la clave pública esté en `~/.ssh/authorized_keys` del usuario correcto
- Verifica los permisos: `chmod 600 ~/.ssh/authorized_keys`
- Verifica que el secret `VPS_SSH_KEY` contenga la clave privada completa

### Error: Connection refused

- Verifica que el puerto SSH esté abierto en el firewall
- Verifica que el servicio SSH esté corriendo: `sudo systemctl status ssh`

### Error: No such file or directory

- Verifica que la ruta `VPS_DEPLOY_PATH` exista en el VPS
- Crea el directorio si no existe: `mkdir -p /var/www/resume`

### El sitio no carga

- Verifica que Nginx esté corriendo: `sudo systemctl status nginx`
- Verifica los logs de Nginx: `sudo tail -f /var/log/nginx/error.log`
- Verifica que los archivos estén en el directorio correcto: `ls -la /var/www/resume`

## Comandos Útiles

```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar configuración de Nginx
sudo nginx -t

# Ver estado del servicio SSH
sudo systemctl status ssh

# Verificar permisos del directorio
ls -la /var/www/resume
```

## Alternativa: Despliegue Manual

Si prefieres desplegar manualmente:

```bash
# En tu máquina local
npm run build

# Copiar archivos al VPS
scp -r dist/* usuario@tu-vps-ip:/var/www/resume/
```

