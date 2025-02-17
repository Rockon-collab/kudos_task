# Kudos

## Project Overview

The Kudos project is a web application designed to facilitate the exchange of kudos between members of the same organization. Each member can send up to 3 kudos per week. Every week, each member's kudos balance is reset to 3. The project uses Django for the backend, React for the frontend, and Docker for containerization. Django RQ is used to manage background tasks, such as the weekly reset of kudos balances.

### Key Features:
1. **Kudos Sending**:
   - Each member can send up to 3 kudos per week to other members within the same organization.
   - A member’s kudos balance is reset every week to 3, with the help of Django RQ to manage background tasks.

2. **Kudos Balance Reset**:
   - A background task is triggered each week to reset the kudos balance for all members.
   - This reset is managed using Django RQ, which ensures that the task runs efficiently in the background.

3. **User Interface**:
   - A user-friendly interface is built using React, where users can see their kudos balance, send kudos, and view their transaction history.
   - The frontend communicates with the Django backend to display the updated kudos balance and handle the sending of kudos.

### Technology Stack:
- **Backend**: Django
- **Frontend**: React
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Background Tasks**: Django RQ (Redis Queue) for managing the kudos balance reset every week

## Installation

### Prerequisites:
Before starting, ensure you have the following installed:
- Docker
- Python 3.9 or later
- PostgreSQL
- Node.js and npm (for the React frontend)

### Setup Instructions:

1. Clone the repository `https://github.com/Rockon-collab/kudos_task`
2. Navigate into the project directory.
3. Run the following command to build and start the containers:
   ```bash
   docker-compose up --build
