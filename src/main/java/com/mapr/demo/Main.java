package com.mapr.demo;

import com.mapr.demo.producer.DataGenerator;

/**
 * Application entry point
 */
public class Main {

    public static void main(String[] args) throws Exception {

        if (args.length != 3) {
            System.out.println("\n***************\nMust use 3 parameters : \n\t web port topic \n or \n\t data topic file \n*************** ");
            System.exit(-1);
        }

        String[] params = new String[args.length - 1];
        System.arraycopy(args, 1, params, 0, args.length - 1);

        if (args[0].equalsIgnoreCase("web")) {
            WebServer.main(params);
        } else if (args[0].equalsIgnoreCase("data")) {
            DataGenerator.main(params);
        } else {
            System.out.println("\n***************\nFirst parameter must be 'web' or 'data'\n*************** ");
            System.exit(-1);
        }

    }

}
