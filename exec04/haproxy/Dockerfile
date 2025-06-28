FROM haproxy:3.1-alpine

EXPOSE 8080

COPY ./haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]