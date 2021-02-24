const axios = require('axios');

const payload = {
  blocks: [
    {
      block_id: 'task_name',
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '本を読む'
      }
    },
    {
      block_id: 'task_actions',
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Complete'
          },
          action_id: 'complete'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Delete'
          },
          action_id: 'delete',
          style: 'danger'
        }
      ]
    }
  ]
};

const url = process.env.WEBHOOK_URL;
axios
  .post(url, payload)
  .then(value => {
    console.log('Done: ', value.data);
  })
  .catch(e => {
    console.log('Error: ', e.response.data);
  });
