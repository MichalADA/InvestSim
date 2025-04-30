# analytics/Dockerfile
FROM tomcat:9.0-jdk11-openjdk-slim

# Kopiowanie pliku WAR do katalogu webapps Tomcata
COPY target/analytics.war /usr/local/tomcat/webapps/

# Odsłonięcie portu Tomcata
EXPOSE 8080

# Uruchomienie Tomcata
CMD ["catalina.sh", "run"]