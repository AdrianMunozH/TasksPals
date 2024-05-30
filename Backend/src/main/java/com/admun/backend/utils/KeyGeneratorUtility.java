package com.admun.backend.utils;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KeyGeneratorUtility {

    public static KeyPair generateRSAKey() {

        KeyPair keyPair;

        try {

            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            keyPair = generator.generateKeyPair();

        }catch (Exception e){
            throw new IllegalStateException();
        }

        return keyPair;
    }
}
