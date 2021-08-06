import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_n6AVZMneZ',
    userPoolWebClientId: '1tb6lacu1hsmd1v7vlvejtbq39',
    mandatorySignIn: true,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
})
