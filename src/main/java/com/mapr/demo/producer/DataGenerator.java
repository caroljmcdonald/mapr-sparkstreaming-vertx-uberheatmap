package com.mapr.demo.producer;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;

/**
 * Simple class to generate ECG data and post it to a stream
 */
public class DataGenerator {

  // Declare a new producer
  public static KafkaProducer producer;

  private static long timeStamp = System.currentTimeMillis();
  private static long tickInterval = 120; // increment use for each tick

  private static List<Float> messageBuffer = null;
  // Set the default stream and topic to publish to.
  private static String topic;
  private static String fileName;
  private static Integer partition =0;
  private static String  key="ekg124";

  public static void main(String[] args) throws IOException, InterruptedException {

    if (args.length != 2) {
      throw new IllegalArgumentException("Must have the topic and file parameter :  DataGenerator /apps/iot_stream:ecg /data/ecg.tsv ");
    }
    topic = args[0];
    fileName = args[1];

    System.out.println("Sending to topic " + topic);
    configureProducer();
    File f = new File(fileName);
    FileReader fr = new FileReader(f);
    BufferedReader reader = new BufferedReader(fr);


    String line = reader.readLine();
    while (line != null) {
      generateKVandPostMessage(line);
      line = reader.readLine();

    }

    producer.close();
    System.out.println("All done.");
    System.exit(1);

  }

  /**
   * MapR Streams Producer configuration
   */
  private static void configureProducer() {
    Properties props = new Properties();
    props.put("key.serializer",
            "org.apache.kafka.common.serialization.StringSerializer");
    props.put("value.serializer",
            "org.apache.kafka.common.serialization.StringSerializer");
    props.put("streams.buffer.max.time.ms", 100);

    producer = new KafkaProducer<>(props);
  }


  /**
   * Parse the line and send a new JSON String to the topic that contains
   * @param line
   * @throws InterruptedException
   */
  private static void generateKVandPostMessage(String line) throws InterruptedException {
 //   StringTokenizer st = new StringTokenizer(line,"\t");
 //   while (st.hasMoreTokens()) {
  //    timeStamp = timeStamp + tickInterval;
    // String entry = String.format("{\"ts\":%1d,\"value\":%2s}", timeStamp, st.nextToken());
      System.out.println(line);
      ProducerRecord<String, String> rec = new ProducerRecord<>(topic,partition,key, line);
      producer.send(rec);
      Thread.sleep(tickInterval); // pause to send new tick to simulate device activity
   // }

  }


}
