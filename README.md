

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/github_username/repo">
    <img src="assets/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Commhawk</h3>

  <p align="center">
   🛰 Real time emergency alerting and incident reporting system 🛰️
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project
**Commhawk is an emergency alerting and incident reporting system which is ideal for government institutes/organisations that are in the domain of disaster management.**
[![Product Name Screen Shot][product-screenshot]](https://example.com)

The repository contain the backend code for the project Commhawk. The project comprises of 2 modules which are independently implemented for emergency alerting and incident reporting. The project is designed and implemented according to the microservices architecture. 

### Built With

* [NodeJS](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [RethinkDB](https://rethinkdb.com/)
* [Postgresql](https://www.postgresql.org/)
* [Python](https://www.python.org/)
* [Firebase](https://firebase.google.com/)
* [AWS](https://aws.amazon.com/)
* [Socket.io](https://socket.io/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them on a debian linux environment.
* docker
* docker-compose

Installing Docker on Ubuntu 18.04 LTS
```sh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
```
Installing Docker-compose on Ubuntu 18.04 LTS

```ssh
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### Installation
 
1. Clone the repo 
```sh
git clone https://github.com/NomadXD/commhawk.git
cd commhawk
```
2. Build the project with docker-compose
```sh
docker-compose build
```
3. Start the services with docker-compose
```sh
docker-compose up
```
<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/github_username/repo/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Lahiru Udayanga - lahiru97udayanga@gmail.com
<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* Dr. Dulani Meedeniya
Senior Lecturer,
Department of Computer Science and Engineering,
University of Moratuwa,
Sri Lanka
* Mr. Sachin Kahawala,
Mentor,
Department of Computer Science and Engineering,
University of Moratuwa,
Sri Lanka






<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: assets/images/cover.png
