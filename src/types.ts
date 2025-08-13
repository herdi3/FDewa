@@ .. @@
 export interface Notification {
     id: string;
     title: string;
     message: string;
     timestamp: string; // ISO date string
     isRead: boolean;
     icon: 'lead' | 'deadline' | 'revision' | 'feedback' | 'payment' | 'completed' | 'comment';
-    link?: {
-        view: ViewType;
-        action: NavigationAction;
-    };
+    linkView?: ViewType;
+    linkAction?: NavigationAction;
 }