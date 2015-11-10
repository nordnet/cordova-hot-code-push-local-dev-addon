package com.nordnetab.chcp.localdev;

import android.util.Log;

import com.nordnetab.chcp.localdev.config.ChcpXmlConfig;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONException;

import java.net.URL;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by Nikolay Demyankov on 03.11.15.
 * <p/>
 * Plugin main class.
 */
public class HotCodePushLocalDevPlugin extends CordovaPlugin {

    private Socket devSocket;
    private ChcpXmlConfig chcpXmlConfig;
    private CallbackContext defaultCallback;
    private boolean updateRequested;
    private boolean isChcpPluginInstalled;

    private static final String JS_INIT_COMMAND = "jsInitPlugin";
    private static final String NEW_RELEASE_SOCKET_EVENT = "release";
    private static final String HOT_CODE_PUSH_PLUGIN = "com.nordnetab.chcp.main.HotCodePushPlugin";

    // region Plugin public methods

    @Override
    public void initialize(final CordovaInterface cordova, final CordovaWebView webView) {
        super.initialize(cordova, webView);

        // parse config only if main plugin is installed
        isChcpPluginInstalled = isHotCodePushPluginIsInstalled();
        if (isChcpPluginInstalled) {
            parseCordovaConfigXml();
        }
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        if (!JS_INIT_COMMAND.equals(action)) {
            return false;
        }

        defaultCallback = callbackContext;
        if (updateRequested) {
            fetchUpdate();
        }

        return true;
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
     * Check if Hot Code Push plugin is installed.
     * If not - there is no point in working.
     *
     * @return <code>true</code> - plugin is installed; otherwise - <code>false</code>
     */
    private boolean isHotCodePushPluginIsInstalled() {
        try {
            Class.forName(HOT_CODE_PUSH_PLUGIN);
        } catch(ClassNotFoundException e) {
            Log.w("CHCP", "Hot Code Push Plugin is not installed! Local development add-on is not gonna work.");
            return false;
        }

        return true;
    }

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

    /**
     * Fetch new update from the server.
     * We will send request to the JS side, which will call appropriate JS module.
     */
    private void fetchUpdate() {
        if (defaultCallback == null) {
            return;
        }
        updateRequested = false;

        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(true);
        defaultCallback.sendPluginResult(result);
    }

    // endregion

    // region Local development socket

    /**
     * Connect to local server to listen for update in real time.
     * Called only when local development mode is enabled in config.xml
     */
    private void connectToLocalDevSocket() {
        if (!isChcpPluginInstalled || !chcpXmlConfig.getDevelopmentOptions().isEnabled()) {
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

            }).on(NEW_RELEASE_SOCKET_EVENT, new Emitter.Listener() {

                @Override
                public void call(Object... args) {
                    Log.d("CHCP", "New Release is available");
                    updateRequested = true;
                    fetchUpdate();
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
