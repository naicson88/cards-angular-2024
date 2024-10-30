// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  devCardsMain: 'http://localhost:8080/yugiohAPI',
  //devCardsMain: 'http://yugihub.us-east-1.elasticbeanstalk.com/yugiohAPI',
  devCardsAdmin: 'http://localhost:8081/v1/admin',
  cardsAPIGateway:'http://localhost:8082',
  userAdmin: 'alannaicson'
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.