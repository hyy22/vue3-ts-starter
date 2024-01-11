import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    permission?: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
  }
}
