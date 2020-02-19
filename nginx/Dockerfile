FROM alpine:3.4
ENV NGINX_VERSION 1.13.6

COPY install.sh /usr/src/
COPY nginx.key /usr/src/

RUN sh -x /usr/src/install.sh

COPY nginx.conf /etc/nginx/nginx.conf
COPY sites-enabled/eaw /etc/nginx/conf.d/default.conf

# Create hashed temporary upload locations
RUN mkdir -p /var/www/upload/0 && \
	mkdir -p /var/www/upload/1 && \
	mkdir -p /var/www/upload/2 && \
	mkdir -p /var/www/upload/3 && \
	mkdir -p /var/www/upload/4 && \
	mkdir -p /var/www/upload/5 && \
	mkdir -p /var/www/upload/6 && \
	mkdir -p /var/www/upload/7 && \
	mkdir -p /var/www/upload/8 && \
	mkdir -p /var/www/upload/9 && \
	mkdir -p /var/www/vault/ && \
	mkdir -p /var/www/download/ && \
    chmod 777 -R /var/www/upload

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
