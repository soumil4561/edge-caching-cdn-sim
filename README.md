
# Content Serving Optimization using Edge Servers
This project focuses on implementing edge caching optimization to enhance content delivery. By leveraging edge servers and caching mechanisms, it aims to address challenges such as high latency, server overload, and inefficient bandwidth usage. The solution utilizes NGINX for caching, Docker for containerization, and JMeter for performance evaluation, showcasing the potential of edge caching to improve scalability, reliability, and user satisfaction in modern content delivery networks.

## Features

- Edge Caching with NGINX: Efficient caching at the edge servers to reduce latency and improve performance.
- Containerized Deployment: Docker-based architecture for easy scalability and portability.
- Performance Evaluation with JMeter: Comprehensive testing and analysis of cache hit rates, server load, and latency.


## Run Locally

Clone the project

```bash
  git clone https://github.com/IIITV-5G-and-Edge-Computing-Activity/Content-Serving-Optimization-using-Edge-Caching.git
```

Go to the project directory and install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon index.js
```

To run the docker orchastrastion of all the containers (make sure the port 8080 is free, or change it in the compose file)
```bash
docker compose up
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`CACHE_EXPIRY`

`FILE_DIRECTORY`


## Running Tests

To run tests, install the Apache JMeter from [here](https://jmeter.apache.org/download_jmeter.cgi) and open the CDN Simulation.jmx file in the project repository. Make sure to configure the server ip accordingly to where you run the server.
## Video
[Video Link](https://drive.google.com/file/d/1wfJcv1PnKGucE8nbuAWcIDSl07Lih1Tz/view?usp=sharing)
