export const AppConstants = {
    clientId: 'Naia@inContact Inc.',
    // TODO: consider changing this format when localization will be applied
    dateFormat: 'MM/dd/yyyy HH:mm:ss',
    defaultIanaTimezone: 'utc',
    // TODO improve this later
    acdPaths: {
      tokenExchange: 'Token',
      // TODO enhance, use it in both platforms
      whoAmIPath: 'Token/WhoAmI',
      serverTime: 'services/v3.0/server-time'
    },
    cxonePaths: {
      permissions: 'authorization/v1/role/permissions',
      tokenExchange: 'public/authentication/v1/token',
      tokenRefresh: 'public/authentication/v1/refresh'
    },
    metrics: [
      {
        guid: '142b1843-fd24-4718-a074-067984dbad63',
        tag: 'SpeechVelocity',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Speech velocity',
        image_src: 'speech-velocity',
        is_sentiment_score: false
      },
      {
        guid: '057aceb5-300a-464e-9ec4-83ec64aea3e6',
        tag: 'ActiveListening',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Active Listening',
        image_src: 'active-listening',
        is_sentiment_score: false
      },
      {
        guid: '6e02a01f-a61a-40d6-9da0-26ec1a63c4a8',
        tag: 'BeEmpathetic',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Be Empathetic',
        image_src: 'be-empathetic',
        is_sentiment_score: false
      },
      {
        guid: 'a0a6ceef-6b40-4d8c-8473-0cb7a8b67389',
        tag: 'Interrupton',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Interruption',
        image_src: 'interruption',
        is_sentiment_score: false
      },
      {
        guid: 'd14dc42e-e72b-4ed8-8cf5-dfeb37050084',
        tag: 'DemonstrateOwnership',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Demonstrate Ownership',
        image_src: 'demonstrate-ownership',
        is_sentiment_score: false
      },
      {
        guid: '6281b662-1823-4866-9b17-1a3f1e3feedb',
        tag: 'BuildRapport',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Build Rapport',
        image_src: 'build-rapport',
        is_sentiment_score: false
      },
      {
        guid: 'ce29b5b7-cc95-432d-8548-ad9683db0677',
        tag: 'SetExpectations',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Set Expectations',
        image_src: 'set-expectations',
        is_sentiment_score: false
      },
      {
        guid: 'c1dd74d9-4314-4acd-9700-98dbcaeb6553',
        tag: 'EffectiveQuestioning',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Effective Questioning',
        image_src: 'effective-questioning',
        is_sentiment_score: false
      },
      {
        guid: 'bc614023-d5c5-4642-aed3-d62eafda5a78',
        tag: 'PromoteSelfService',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Promote Self-service',
        image_src: 'promote-self-service',
        is_sentiment_score: false
      },
      {
        guid: '0f9142bb-0f6a-4786-a20d-015f6b1190e9',
        tag: 'AcknowledgeLoyalty',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Acknowledge Loyalty',
        image_src: 'acknowledge-loyalty',
        is_sentiment_score: false
      },
      {
        guid: '7b4534e8-181e-45af-9f69-72b95a83fab8',
        tag: 'InappropriateAction',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'Inappropriate Action',
        image_src: 'inappropriate-action',
        is_sentiment_score: false
      },
      {
        guid: '58cd2983-32ba-4d4c-af62-228581b04b1a',
        tag: 'Sentiment',
        type: 'SENTIMENT_MODEL',
        frienly_name: 'OverallSentiment',
        image_src: 'meh',
        is_sentiment_score: true
      }
    ],
    rangesOfMetric: [{
      min: -100,
      max: 0,
      color: '#E3E3E3',
      label: 'no score',
      severity: 'none',
      imageSrc: 'meh'
    },
    {
      min: 0,
      max: 30,
      color: '#FF2B53',
      label: 'bad score',
      severity: 'high',
      imageSrc: 'inappropriate-action'
    },
    {
      min: 30,
      max: 70,
      color: '#FFBA1F',
      label: 'neutral score',
      severity: 'medium',
      imageSrc: 'meh'
    },
    {
      min: 70,
      max: 100,
      color: '#36C700',
      label: 'very good score',
      severity: 'low',
      imageSrc: 'smile'
    }
    ],
    disableColor: '#E3E3E3'
};
