# Use the official Python 3.10 base image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy project files to the container
COPY examate/backend/examate_project/ .

# Update and install necessary dependencies
RUN apt-get update && apt-get install -y python3-pip python3-venv

# Create and activate a virtual environment
RUN python3 -m venv /app/project-env
ENV DATABASE_NAME=test \
    DATABASE_USER=test \
    DATABASE_PASSWORD=12345678 \
    DATABASE_HOST=mysqlservice \
    DATABASE_PORT=3306

# Install dependencies
RUN /app/project-env/bin/pip install --no-cache-dir -r requirement.txt

# Set environment variables
ENV PATH="/app/project-env/bin:$PATH"

# Expose the desired port
EXPOSE 8089

# Set the default command to run the application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8089"]

