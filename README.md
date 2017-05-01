
# MapR Streams & Vert.x Sample Application

This project shows how you can use [Vert.x](http://vertx.io/) to consume data from MapR Streams.
The data are send using the Vert.x bus from the server to the browser using Websockets.

### Prerequisites

* Java Development Kit 8
* Maven 3.3 or later
* Mapr cluster with MapR Streams


## Build and Run the application

**Configuration**

Create a MapR Streams and Topic

```
$ maprcli stream create -path /apps/iot_stream -produceperm p -consumeperm p -topicperm p


$ maprcli stream topic create -path /apps/iot_stream -topic uberp
```


**Build the Web Application**

```
cd mapr-streams-vertx-uberdashboard

mvn clean package
```

**Run the Application**

Open 2 terminal windows and run the following command:

Web Application (Vert.x application)

```
$ java -jar ./target/mapr-streams-vertx-uberdashboard-1.0-SNAPSHOT-fat.jar web 8080 /apps/iot_stream:uberp
```

Open your browser and go to [http://localhost:8080](http://localhost:8080) and click in the menu to see the different views.

Generate uber data on the topic

```
$ java -jar ./target/mapr-streams-vertx-uberdashboard-1.0-SNAPSHOT-fat.jar data /apps/iot_stream:uberp ./data/cluster.txt
```

The Web application should show the heatmap with the data coming from the MapR Stream topic.


## Tips & Technique

To send data to the browser, this application uses the Vert.x bus, see the code in `com.mapr.demo.WebServer`. 
The `main()` method creates the Web Server and initialize the bus exposed as a Web socket.

In the browser you just need to add some Javascript to received event from the bus see for example the `log.html`, 
and the javascript at the bottom of the page.

