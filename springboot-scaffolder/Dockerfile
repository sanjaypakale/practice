# Step 1: Use JDK 17 as the base image
FROM openjdk:17-jdk-slim

# Step 2: Set the working directory inside the container
WORKDIR /app
RUN mkdir /app/logs
# Step 3: Copy the jar file into the container
COPY payment-service-0.0.1-SNAPSHOT.jar app.jar

# Step 4: Expose the port your app will run on (usually 8080 for Spring Boot)
EXPOSE 8889

# Step 5: Set the entrypoint to run the jar file
#ENTRYPOINT ["java", "-jar", "app.jar"]

ENTRYPOINT ["sh", "-c", "java -jar app.jar > /app/logs/app.log 2>&1"]
