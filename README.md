

<!-- PROJECT LOGO -->
<br />
<div align="left">
  <a href="https://app.bloodsense.online/" style="display:flex; align-items:center;">
    <img src="https://app.bloodsense.online/_next/image?url=%2FAppLogoCircle.png&w=64&q=75" alt="Logo" width="80" height="80" style="margin-right:20px">
	<h1>BloodSense</h1>
	</h1>
  </a>


<!-- ABOUT THE PROJECT -->
## About The Project


This is a full-stack desktop web application to help people better organize and track their bloodwork history to spot trends, and take action. Users can also manually upload their bloodwork documents to one place, which are encrypted at rest. The website can be found here: https://app.bloodsense.online.  
This app authenticates its users using a session-based approach using express-session and passport.js on the server side. There are two approaches to signing into the app: Google SSO, and the traditional username and password method. The client and server applications themselves are hosted as subdomains under a custom domain from NameCheap. User data is stored in a PostgreSQL database hosted on Azure Cloud, files and images are encrypted at rest and stored in Azure Blob Storage containers, and bloodwork data is stored in Azure Cosmos DB containers. I have made this as an extension to the mobile version of this app which can be found on the Google Play Store [here](https://play.google.com/store/apps/details?id=com.ishaanp.test&hl=en_IN&gl=US).



### Built With

* [![][Microsoft Azure]][Azure-url]
* [![][AWS]][AWS-url]
* [![][Docker]][Node-url]
* [![Node][Node.js]][Node-url]
* [![][MySQL]][SQL-url]
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Express][Express.js]][Express-url]
* [![Passport][Passport.js]][Passport-url]
* [![][Google Cloud]][GoogleCloud-url]
* [![][Vercel]][Vercel-url]
* [![][Render]][Render-url]
* [![][NameCheap]][Namecheap-url]
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Status -->
## Status

This project is currently production-ready [here](https://app.bloodsense.online/). However, I am actively making changes and adding new features to this app. I plan to eventually scale this application up.



## Usage

1. Log in or create a new account with Google Single sign-on, or with first name, username and password.
2. Once logged in, you will be directed to the dashboard. The dashboard and sidebar will both have links to different area of the app, along with other statistics such as recent activity, current health information, and a prompt to complete your profile.
3. Different areas of the website include: 
	• **Profile**: A place to edit your personal information and profile picture.
	• **Past Records**: A place to view previous bloodwork records or create a new record.
	• **Past Documents**: A place to view previously uploaded documents or upload new    documents
	• **Analysis**: A place where the user can compare specific biomarker data or record data in detail. Charts, and tables will be provided to easily spot trends and take action if needed.

## Screenshots

##### Dashboard
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/dashboard.png">

##### Creating New Record
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/new_record.png">

##### Sample Bloodwork Analysis 
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/sample_analysis1.png">
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/sample_analysis2.png">
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/sample_analysis3.png">

##### Viewing Past Records
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/past_records.png">

##### Viewing Past Documents
<img src="https://raw.githubusercontent.com/Ishaan35/BloodSense/main/app_screenshots/past_documents.png">



<!-- ROADMAP -->
## Roadmap

- [ ] Add sub-profiles
- [ ] Add custom notes feature for every record
- [ ] Appointment booking reminder







<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.




<!-- CONTACT -->
## Contact

Ishaan Patel  -  toishaanpatel@gmail.com

LinkedIn:  https://www.linkedin.com/in/ishaan35/

Personal Website: https://www.ishaanpatel.info/

Project Link: https://app.bloodsense.online








<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png


[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Node.js]: https://img.shields.io/badge/node-3e3f34?style=for-the-badge&logo=nodedotjs&logoColor=green
[Next-url]: https://nextjs.org/
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Express.js]: https://img.shields.io/badge/Express.js-35495E?style=for-the-badge&logo=express
[Express-url]: https://expressjs.com/
[Passport.js]:https://img.shields.io/badge/Passport.js-4a4a55?style=for-the-badge&logo=passport
[Passport-url]:https://www.passportjs.org/
[MySQL]:https://img.shields.io/badge/MySQL-ccd4ed?style=for-the-badge&logo=mysql&logoColor=910000
[SQL-url]:https://www.mysql.com/
[Google Cloud]: https://img.shields.io/badge/Google%20Cloud-5c5866?style=for-the-badge&logo=google-cloud
[GoogleCloud-url]: https://cloud.google.com/
[Microsoft Azure]: https://img.shields.io/badge/Microsoft%20Azure-343440?style=for-the-badge&logo=microsoft-azure&logoColor=42adff
[Azure-url]: https://azure.microsoft.com/en-us/
[AWS]: https://img.shields.io/badge/Amazon%20Web%20Services-232f3f?style=for-the-badge&logo=amazon-aws&logoColor=ec912d
[AWS-url]: https://aws.amazon.com
[Vercel]:https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=ffffff
[Vercel-url]:https://vercel.com/dashboard
[Render]:https://img.shields.io/badge/Render-4351e8?style=for-the-badge&logo=render&logoColor=ffffff
[Render-url]:https://render.com/
[NameCheap]:https://img.shields.io/badge/NameCheap-ff8c44?style=for-the-badge&logo=namecheap&logoColor=ffffff
[Namecheap-url]:https://www.namecheap.com/domains/
[Docker]:https://img.shields.io/badge/Docker-0092e6?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/


[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
