package ke.ac.school.cbe;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SecureStoragePlugin.class);
        registerPlugin(BiometricPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
