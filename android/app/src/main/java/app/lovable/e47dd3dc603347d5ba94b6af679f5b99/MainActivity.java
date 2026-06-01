package app.lovable.e47dd3dc603347d5ba94b6af679f5b99;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Don't draw content behind status bar
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(true);
        }

        // Set status bar color to match app background
        getWindow().setStatusBarColor(android.graphics.Color.parseColor("#F7F3EF"));
    }
}
