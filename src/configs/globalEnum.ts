export enum EMIT_TYPE {
  IMAGE,
  XHR,
  FETCH,
  CUSTOM
}

export enum ACTION_LEVEL {
  INFO = 0,
  WARNING = 1,
  ERROR = 2,
  CARSH = 3
}

export enum ACTION_GROUP {
  PERFORMANCE = "performance",
  TIMEOUT = "timeout",
  RESOURCE_ERROR = "resource_error",
  VUE_ERROR = "vue_error",
  GLOBAL_ERROR = "global_error",
  GLOBAL_UNCAUGHT = "global_uncaught",
  DEFAULT = "default"
}

export enum CONSUMER_TYPE {
  DEAFULT,
  WEBTRENDS
}
