"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
var expo_router_1 = require("expo-router");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var AppContext_1 = require("../src/context/AppContext");
var BooksContext_1 = require("../src/context/BooksContext");
var lucide_react_native_1 = require("lucide-react-native");
react_native_1.LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
function TabsLayout() {
    var _a = (0, AppContext_1.useApp)(), theme = _a.theme, t = _a.t;
    return (<expo_router_1.Tabs backBehavior="history" screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: theme.card,
                borderTopColor: theme.cardBorder,
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textMuted,
        }}>
      <expo_router_1.Tabs.Screen name="index" options={{
            title: t('search'),
            tabBarIcon: function (_a) {
                var color = _a.color, size = _a.size;
                return <lucide_react_native_1.Home color={color} size={size}/>;
            },
        }}/>
      <expo_router_1.Tabs.Screen name="library" options={{
            title: t('myLibrary'),
            tabBarIcon: function (_a) {
                var color = _a.color, size = _a.size;
                return <lucide_react_native_1.Library color={color} size={size}/>;
            },
        }}/>
      <expo_router_1.Tabs.Screen name="settings" options={{
            title: t('settings'),
            tabBarIcon: function (_a) {
                var color = _a.color, size = _a.size;
                return <lucide_react_native_1.Settings color={color} size={size}/>;
            },
        }}/>
      <expo_router_1.Tabs.Screen name="book/[id]" options={{
            href: null,
        }}/>
    </expo_router_1.Tabs>);
}
function Layout() {
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <AppContext_1.AppProvider>
        <BooksContext_1.BooksProvider>
          <TabsLayout />
        </BooksContext_1.BooksProvider>
      </AppContext_1.AppProvider>
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
