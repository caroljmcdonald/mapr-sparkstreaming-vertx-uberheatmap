Running the Spark Machine Learning and Spark Streaming part of the uber application:

Install and fire up the Sandbox using the instructions here: http://maprdocs.mapr.com/home/SandboxHadoop/c_sandbox_overview.html. 

Use an SSH client such as Putty (Windows) or Terminal (Mac) to login. See below for an example:
use userid: user01 and password: mapr.

For VMWare use:  $ ssh user01@ipaddress 

For Virtualbox use:  $ ssh user01@127.0.0.1 -p 2222 

You can build this project with Maven using IDEs like Eclipse or NetBeans, and then copy the JAR file to your MapR Sandbox, or you can install Maven on your sandbox and build from the Linux command line, 
for more information on maven, eclipse or netbeans use google search. 

After building the project on your laptop, you can use scp to copy your JAR file from the project target folder to the MapR Sandbox:

use userid: user01 and password: mapr.
For VMWare use:  $ scp  nameoffile.jar  user01@ipaddress:/user/user01/. 

For Virtualbox use:  $ scp -P 2222 nameoffile.jar  user01@127.0.0.1:/user/user01/.  

Copy the data file from the project data folder to the sandbox using scp to this directory /user/user01/data/uber.csv on the sandbox:

For Virtualbox use:  $ scp -P 2222 data/uber.csv  user01@127.0.0.1:/user/user01/data/. 

By default, the Spark classpath doesn't contain  spark-streaming-kafka-0-9_2.11.jar and spark-streaming-kafka-producer_2.11-2.0.1-mapr-1611.jar 
which you can get here:  
http://repository.mapr.com/nexus/content/groups/mapr-public/org/apache/spark/spark-streaming-kafka-producer_2.11/2.0.1-mapr-1611/spark-streaming-kafka-producer_2.11-2.0.1-mapr-1611.jar
http://repository.mapr.com/nexus/content/groups/mapr-public/org/apache/spark/spark-streaming-kafka-0-9_2.11/2.0.1-mapr-1611/spark-streaming-kafka-0-9_2.11-2.0.1-mapr-1611.jar
There are 3 ways:
1. Build your application with spark-streaming-kafka-0-9_2.11.jar as dependencies. 
2. Manually download the jars and put to SparkHome/jars folder.
3. Manually download the jars and pass the path to spark submit script with --jars option

Step 0: Create the topics to read from (ubers) and write to (uberp)  in MapR streams:

$ maprcli stream create -path /apps/iot_stream -produceperm p -consumeperm p -topicperm p
$ maprcli stream topic create -path /apps/iot_stream -topic ubers
$ maprcli stream topic create -path /apps/iot_stream -topic uberp
 
____________________________________________________________________

Step 1:  Run the Spark k-means program which will create and save the machine learning model: 

spark-submit --class com.sparkml.uber.ClusterUber --master local[2] mapr-streams-vertx-uberdashboard-1.0-SNAPSHOT-fat.jar

you can also copy paste  the code from  ClusterUber.scala into the spark shell 

$spark-shell --master local[2]
    
 - For Yarn you should change --master parameter to yarn-client - "--master yarn-client"

____________________________________________________________________

After creating and saving the k-means model you can run the Streaming code:

Step 2: Run the MapR Streams Java producer to produce messages, run the Java producer with the topic (ubers) and data file arguments (uber.csv):

java -cp mapr-streams-vertx-uberdashboard-1.0-SNAPSHOT-fat.jar:`mapr classpath` com.streamskafka.uber.MsgProducer /user/user01/stream:ubers /user/user01/data/uber.csv

Step 3:  Run the Spark Consumer Producer with the arguments: path to model, subscribe topic, publish topic :
(in separate consoles if you want to run at the same time)

spark-submit --class com.sparkkafka.uber.SparkKafkaConsumerProducer --master local[2] \
 mapr-streams-vertx-uberdashboard-1.0-SNAPSHOT-fat.jar /user/user01/data/savemodel  /user/user01/stream:ubers /user/user01/stream:uberp

____________________________________________________________________


To run the MapR Streams Java consumer  with the topic to read from (uberp or ubers):

java -cp mapr-sparkml-streaming-uber-1.0.jar:`mapr classpath` com.streamskafka.uber.MsgConsumer /user/user01/stream:uberp 







