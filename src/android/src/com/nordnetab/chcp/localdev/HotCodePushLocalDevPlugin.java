package com.nordnetab.chcp.localdev;

import android.util.Log;

import com.nordnetab.chcp.main.config.ChcpXmlConfig;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import java.net.URL;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by Nikolay Demyankov on 23.07.15.
 * <p/>
 * Plugin main class.
 */
public class HotCodePushLocalDevPlugin extends CordovaPlugin {

    private Socket devSocket;
    private ChcpXmlConfig chcpXmlConfig;

    // region Plugin lifecycle

    @Override
    public void initialize(final CordovaInterface cordova, final CordovaWebView webView) {
        super.initialize(cordova, webView);

        parseCordovaConfigXml();
    }

    @Override
    public void onStart() {
        super.onStart();

        connectToLocalDevSocket();
    }

    @Override
    public void onStop() {
        disconnectFromLocalDevSocket();

        super.onStop();
    }

    // endregion

    // region Private API

    /**
     * Read hot-code-push plugin preferences from cordova config.xml
     *
     * @see ChcpXmlConfig
     */
    private void parseCordovaConfigXml() {
        if (chcpXmlConfig != null) {
            return;
        }

        chcpXmlConfig = ChcpXmlConfig.loadFromCordovaConfig(cordova.getActivity());
    }

    // endregion

    // region Local development socket

    /**
     * Connect to local server to listen for update in real time.
     * Called only when local development mode is enabled in config.xml
     */
    private void connectToLocalDevSocket() {
        if (!chcpXmlConfig.getDevelopmentOptions().isEnabled()) {
            return;
        }

        try {
            URL serverURL = new URL(chcpXmlConfig.getConfigUrl());
            String socketUrl = serverURL.getProtocol() + "://" + serverURL.getAuthority();

            devSocket = IO.socket(socketUrl);
            devSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    Log.d("CHCP", "Socket connected");
                }

            }).on("release", new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    Log.d("CHCP", "New Release is available");
                    //fetchUpdate(null);
                }

            }).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    Log.d("CHCP", "Socket disonnected");
                }

            });
            devSocket.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Disconnect from local server.
     */
    private void disconnectFromLocalDevSocket() {
        if (devSocket == null) {
            return;
        }

        devSocket.close();
        devSocket.off();
        devSocket = null;
    }

    // endregion
}
