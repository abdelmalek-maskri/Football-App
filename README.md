## Football APP

This application was generated using JHipster 7.9.4, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.9.4](https://www.jhipster.tech/documentation-archive/v7.9.4).

Football Connect is a state-of-the-art web application crafted to serve the global football community. As part of the Team Project 2024 module, this platform is designed to offer an immersive football experience, providing users with the tools to engage with the sport that they love in various interactive and meaningful ways. 

The application can be accessed via the link: https://team14.bham.team  

The application can be accessed by registering as a new user or by using the following login details: 

Username: alexmorgan 
Password: At#5W!nKtZPd2@*sU98UoRvLi6M!hRM9 

Detailed Features 

# User Registration and Profile Customization :

Football Connect provides an effortless registration process, inviting people to join our vibrant football community. Upon joining, users are prompted to create their public user profile by specifying their preferences of name, profile picture, and contact details which can be used for other users to contact them. Users can also select their play position (i.e. striker, defence, etc.), and whether they would also like to referee for matches. In addition to this, players can add their availability which will appear on their profile as well as contact details allowing other users to contact them so that they can connect. 

# Player Networking and Searching :
The player search feature allows users to find one another by position, area they are in, or name. This feature helps to create a network which is essential for the coordination of local matches, and uniting football players around the world. The application provides a sense of community and passion for football, allowing users to develop meaningful connections with one another as they participate in playing games of football together. Thus, this feature makes it very easy for users to find players for their matches and teams. 

# Team Formation, Management and Searching :
For those looking to join a team, we have a team search page where users can browse through all the registered teams on our app. Users can discover lots of different teams near them and click on a team to view its team profile. Here, they can see the full name and description of the team, a list of players who are playing for them, and the teams game schedule and play-type too. If someone wants to form their own team, then they can do so by clicking on the create team button. Registration for a new team is as simple as completing a short form and uploading a picture of the team’s icon. Then, the team is publicly discoverable on our team search page, where the user can invite their friends to search up and join their team. 

# Pitch Finder and Scheduler :
Our app simplifies the task of finding and booking football pitches. A user can view a list of pitch locations, what time they are available, and then book them. The pitch booking feature lets them book a pitch for their next game or practice session, making it easy to plan ahead. This feature helps the user to tackle the hassle of locating and reserving a place to play, ensuring that teams can focus on playing or practicing for games rather than having to worry about the hassle of finding and booking pitches. 

# Tournaments :
This feature is for competitive players and teams looking to compete in tournaments which are hosted on our application. Players can join an open tournament for their team, and users are able to see a list of all the upcoming matches and see scores of the previous matches which have been played. This feature brings an aspect of competition in our app, as each team participating would strive to succeed in winning each tournament. Tournaments are scheduled to be hosted one after another, allowing teams to have another chance at competing again if they have been knocked out of the tournament after a loss. 

# Match Updates and Scores :
The Matches page allows users to see the matches of a tournament, alongside with updates and scores of each game that has taken place. The matches are displayed on a monthly calendar, and groups matches occurring by day. This keeps users in the loop with their team's progress and the outcome of games that they are interested in. Upon clicking on a match, you can view more details about it such as details of the home and away team, a list of players from each team, the score of the game, and referee of the match. 

# Player Performance Feedback and Ratings :
The feedback and rating system on Football Connect allows players to leave reviews about each other’s performance. After a match, users can leave comments and ratings for players that they've played with or against. On the leaderboard, the ratings of each user are ranked from highest to lowest and by clicking on them you can see how everyone in the community has rated and reviewed each other's performance.  You can also leave likes on a comment, and the comments with the most likes will be promoted further to the top of the page. 
 

### Install development environment

Requires Java JDK, npm, node
`% java --version openjdk 11.0.17 2022-10-18`

`% mvn -version Apache Maven 3.9.4`

`% npm -version 8.19.3`

`% node --version v18.13.0`

JHipster v7.9.4 maintenance is installed using NPM
`npm install -g jhipster/generator-jhipster#v7.x_maintenance`

### Settings used:

- `? Which *type* of application would you like to create? Monolithic application (recommended for simple projects) `
- `? What is the base name of your application? teamproject `
- `? Do you want to make it reactive with Spring WebFlux? No `
- `? What is your default Java package name? team.bham `
- `? Which *type* of authentication would you like to use? JWT authentication (stateless, with a token) `
- `? Which *type* of database would you like to use? SQL (H2, PostgreSQL, MySQL, MariaDB, Oracle, MSSQL) `
- `? Which *production* database would you like to use? PostgreSQL `
- `? Which *development* database would you like to use? H2 with disk-based persistence `
- `? Which cache do you want to use? (Spring cache abstraction) Ehcache (local cache, for a single node) `
- `? Do you want to use Hibernate 2nd level cache? Yes `
- `? Would you like to use Maven or Gradle for building the backend? Maven `
- `? Do you want to use the JHipster Registry to configure, monitor and scale your application? No `
- `? Which other technologies would you like to use? `
- `? Which *Framework* would you like to use for the client? Angular `
- `? Do you want to generate the admin UI? Yes ? Would you like to use a Bootswatch theme (https://bootswatch.com/)? Flatly `
- `? Choose a Bootswatch variant navbar theme (https://bootswatch.com/)? Light `
- `? Would you like to enable internationalization support? No `
- `? Please choose the native language of the application English `
- `? Besides JUnit and Jest, which testing frameworks would you like to use? `
- `? Would you like to install other generators from the JHipster Marketplace? No`

## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husky, and others that are well known and you can find references in the web.

`/src/*` structure follows default Java structure.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if ommited) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

We use npm scripts and [Angular CLI][] with [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
./mvnw
npm start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is disabled by default. To enable it, uncomment the following code in `src/main/webapp/app/app.module.ts`:

```typescript
ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
```

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Edit [src/main/webapp/app/app.module.ts](src/main/webapp/app/app.module.ts) file:

```
import 'leaflet/dist/leaflet.js';
```

Edit [src/main/webapp/content/scss/vendor.scss](src/main/webapp/content/scss/vendor.scss) file:

```
@import '~leaflet/dist/leaflet.css';
```

Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

### Using Angular CLI

You can also use [Angular CLI][] to generate some custom client code.

For example, the following command:

```
ng generate component my-component
```

will generate few files:

```
create src/main/webapp/app/my-component/my-component.component.html
create src/main/webapp/app/my-component/my-component.component.ts
update src/main/webapp/app/app.module.ts
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```
docker-compose -f src/main/docker/jhipster-control-center.yml up
```

## Building for production

### Packaging as jar

To build the final jar and optimize the teamproject application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

## Testing

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

```
npm test
```

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off authentication in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

```
docker-compose -f src/main/docker/postgresql.yml up -d
```

To stop it and remove the container, run:

```
docker-compose -f src/main/docker/postgresql.yml down
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

```
npm run java:docker
```

Or build a arm64 docker image when using an arm64 processor os like MacOS with M1 processor family running:

```
npm run java:docker:arm64
```

Then run:

```
docker-compose -f src/main/docker/app.yml up -d
```

When running Docker Desktop on MacOS Big Sur or later, consider enabling experimental `Use the new Virtualization framework` for better processing performance ([disk access performance is worse](https://github.com/docker/roadmap/issues/7)).

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 7.9.4 archive]: https://www.jhipster.tech/documentation-archive/v7.9.4
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v7.9.4/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v7.9.4/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v7.9.4/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v7.9.4/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v7.9.4/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v7.9.4/setting-up-ci/
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.github.io/
[browsersync]: https://www.browsersync.io/
[jest]: https://facebook.github.io/jest/
[leaflet]: https://leafletjs.com/
[definitelytyped]: https://definitelytyped.org/
[angular cli]: https://cli.angular.io/
