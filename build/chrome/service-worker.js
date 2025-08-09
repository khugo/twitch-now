(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://id.twitch.tv/oauth2/authorize",
      response_type: 'token',
      client_id    : 'wan7tdfzghu0uiisb8xoa1f4rgzsz6',
      client_secret: '2m42qpmxfy5l2ik4c93s0qco4vzfgr0',
      scope        : 'user:read:follows',
      redirect_uri : 'https://ndragomirov.github.io/twitch.html'
    }
  };

  if ( typeof exports !== 'undefined' ) {
    if ( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = constants;
    }
    exports.constants = constants;
  } else {
    root.constants = constants;
  }
}).call(this);

var contributorList = [{"login":"Ndragomirov","id":543401,"node_id":"MDQ6VXNlcjU0MzQwMQ==","avatar_url":"https://avatars.githubusercontent.com/u/543401?v=4","gravatar_id":"","url":"https://api.github.com/users/Ndragomirov","html_url":"https://github.com/Ndragomirov","followers_url":"https://api.github.com/users/Ndragomirov/followers","following_url":"https://api.github.com/users/Ndragomirov/following{/other_user}","gists_url":"https://api.github.com/users/Ndragomirov/gists{/gist_id}","starred_url":"https://api.github.com/users/Ndragomirov/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Ndragomirov/subscriptions","organizations_url":"https://api.github.com/users/Ndragomirov/orgs","repos_url":"https://api.github.com/users/Ndragomirov/repos","events_url":"https://api.github.com/users/Ndragomirov/events{/privacy}","received_events_url":"https://api.github.com/users/Ndragomirov/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":600},{"login":"SW1FT","id":6627739,"node_id":"MDQ6VXNlcjY2Mjc3Mzk=","avatar_url":"https://avatars.githubusercontent.com/u/6627739?v=4","gravatar_id":"","url":"https://api.github.com/users/SW1FT","html_url":"https://github.com/SW1FT","followers_url":"https://api.github.com/users/SW1FT/followers","following_url":"https://api.github.com/users/SW1FT/following{/other_user}","gists_url":"https://api.github.com/users/SW1FT/gists{/gist_id}","starred_url":"https://api.github.com/users/SW1FT/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/SW1FT/subscriptions","organizations_url":"https://api.github.com/users/SW1FT/orgs","repos_url":"https://api.github.com/users/SW1FT/repos","events_url":"https://api.github.com/users/SW1FT/events{/privacy}","received_events_url":"https://api.github.com/users/SW1FT/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":20},{"login":"Seldszar","id":3079214,"node_id":"MDQ6VXNlcjMwNzkyMTQ=","avatar_url":"https://avatars.githubusercontent.com/u/3079214?v=4","gravatar_id":"","url":"https://api.github.com/users/Seldszar","html_url":"https://github.com/Seldszar","followers_url":"https://api.github.com/users/Seldszar/followers","following_url":"https://api.github.com/users/Seldszar/following{/other_user}","gists_url":"https://api.github.com/users/Seldszar/gists{/gist_id}","starred_url":"https://api.github.com/users/Seldszar/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Seldszar/subscriptions","organizations_url":"https://api.github.com/users/Seldszar/orgs","repos_url":"https://api.github.com/users/Seldszar/repos","events_url":"https://api.github.com/users/Seldszar/events{/privacy}","received_events_url":"https://api.github.com/users/Seldszar/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":17},{"login":"zm3y","id":8388687,"node_id":"MDQ6VXNlcjgzODg2ODc=","avatar_url":"https://avatars.githubusercontent.com/u/8388687?v=4","gravatar_id":"","url":"https://api.github.com/users/zm3y","html_url":"https://github.com/zm3y","followers_url":"https://api.github.com/users/zm3y/followers","following_url":"https://api.github.com/users/zm3y/following{/other_user}","gists_url":"https://api.github.com/users/zm3y/gists{/gist_id}","starred_url":"https://api.github.com/users/zm3y/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/zm3y/subscriptions","organizations_url":"https://api.github.com/users/zm3y/orgs","repos_url":"https://api.github.com/users/zm3y/repos","events_url":"https://api.github.com/users/zm3y/events{/privacy}","received_events_url":"https://api.github.com/users/zm3y/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":11},{"login":"leonidasmark","id":4234636,"node_id":"MDQ6VXNlcjQyMzQ2MzY=","avatar_url":"https://avatars.githubusercontent.com/u/4234636?v=4","gravatar_id":"","url":"https://api.github.com/users/leonidasmark","html_url":"https://github.com/leonidasmark","followers_url":"https://api.github.com/users/leonidasmark/followers","following_url":"https://api.github.com/users/leonidasmark/following{/other_user}","gists_url":"https://api.github.com/users/leonidasmark/gists{/gist_id}","starred_url":"https://api.github.com/users/leonidasmark/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/leonidasmark/subscriptions","organizations_url":"https://api.github.com/users/leonidasmark/orgs","repos_url":"https://api.github.com/users/leonidasmark/repos","events_url":"https://api.github.com/users/leonidasmark/events{/privacy}","received_events_url":"https://api.github.com/users/leonidasmark/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":10},{"login":"OogieBoogieInJSON","id":1884609,"node_id":"MDQ6VXNlcjE4ODQ2MDk=","avatar_url":"https://avatars.githubusercontent.com/u/1884609?v=4","gravatar_id":"","url":"https://api.github.com/users/OogieBoogieInJSON","html_url":"https://github.com/OogieBoogieInJSON","followers_url":"https://api.github.com/users/OogieBoogieInJSON/followers","following_url":"https://api.github.com/users/OogieBoogieInJSON/following{/other_user}","gists_url":"https://api.github.com/users/OogieBoogieInJSON/gists{/gist_id}","starred_url":"https://api.github.com/users/OogieBoogieInJSON/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/OogieBoogieInJSON/subscriptions","organizations_url":"https://api.github.com/users/OogieBoogieInJSON/orgs","repos_url":"https://api.github.com/users/OogieBoogieInJSON/repos","events_url":"https://api.github.com/users/OogieBoogieInJSON/events{/privacy}","received_events_url":"https://api.github.com/users/OogieBoogieInJSON/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":7},{"login":"ArnaudLigny","id":80580,"node_id":"MDQ6VXNlcjgwNTgw","avatar_url":"https://avatars.githubusercontent.com/u/80580?v=4","gravatar_id":"","url":"https://api.github.com/users/ArnaudLigny","html_url":"https://github.com/ArnaudLigny","followers_url":"https://api.github.com/users/ArnaudLigny/followers","following_url":"https://api.github.com/users/ArnaudLigny/following{/other_user}","gists_url":"https://api.github.com/users/ArnaudLigny/gists{/gist_id}","starred_url":"https://api.github.com/users/ArnaudLigny/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ArnaudLigny/subscriptions","organizations_url":"https://api.github.com/users/ArnaudLigny/orgs","repos_url":"https://api.github.com/users/ArnaudLigny/repos","events_url":"https://api.github.com/users/ArnaudLigny/events{/privacy}","received_events_url":"https://api.github.com/users/ArnaudLigny/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":5},{"login":"GoryMoon","id":987002,"node_id":"MDQ6VXNlcjk4NzAwMg==","avatar_url":"https://avatars.githubusercontent.com/u/987002?v=4","gravatar_id":"","url":"https://api.github.com/users/GoryMoon","html_url":"https://github.com/GoryMoon","followers_url":"https://api.github.com/users/GoryMoon/followers","following_url":"https://api.github.com/users/GoryMoon/following{/other_user}","gists_url":"https://api.github.com/users/GoryMoon/gists{/gist_id}","starred_url":"https://api.github.com/users/GoryMoon/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/GoryMoon/subscriptions","organizations_url":"https://api.github.com/users/GoryMoon/orgs","repos_url":"https://api.github.com/users/GoryMoon/repos","events_url":"https://api.github.com/users/GoryMoon/events{/privacy}","received_events_url":"https://api.github.com/users/GoryMoon/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":5},{"login":"AGameAnx","id":7431013,"node_id":"MDQ6VXNlcjc0MzEwMTM=","avatar_url":"https://avatars.githubusercontent.com/u/7431013?v=4","gravatar_id":"","url":"https://api.github.com/users/AGameAnx","html_url":"https://github.com/AGameAnx","followers_url":"https://api.github.com/users/AGameAnx/followers","following_url":"https://api.github.com/users/AGameAnx/following{/other_user}","gists_url":"https://api.github.com/users/AGameAnx/gists{/gist_id}","starred_url":"https://api.github.com/users/AGameAnx/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AGameAnx/subscriptions","organizations_url":"https://api.github.com/users/AGameAnx/orgs","repos_url":"https://api.github.com/users/AGameAnx/repos","events_url":"https://api.github.com/users/AGameAnx/events{/privacy}","received_events_url":"https://api.github.com/users/AGameAnx/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":5},{"login":"rooks","id":878189,"node_id":"MDQ6VXNlcjg3ODE4OQ==","avatar_url":"https://avatars.githubusercontent.com/u/878189?v=4","gravatar_id":"","url":"https://api.github.com/users/rooks","html_url":"https://github.com/rooks","followers_url":"https://api.github.com/users/rooks/followers","following_url":"https://api.github.com/users/rooks/following{/other_user}","gists_url":"https://api.github.com/users/rooks/gists{/gist_id}","starred_url":"https://api.github.com/users/rooks/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/rooks/subscriptions","organizations_url":"https://api.github.com/users/rooks/orgs","repos_url":"https://api.github.com/users/rooks/repos","events_url":"https://api.github.com/users/rooks/events{/privacy}","received_events_url":"https://api.github.com/users/rooks/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":4},{"login":"Gh0sty","id":665445,"node_id":"MDQ6VXNlcjY2NTQ0NQ==","avatar_url":"https://avatars.githubusercontent.com/u/665445?v=4","gravatar_id":"","url":"https://api.github.com/users/Gh0sty","html_url":"https://github.com/Gh0sty","followers_url":"https://api.github.com/users/Gh0sty/followers","following_url":"https://api.github.com/users/Gh0sty/following{/other_user}","gists_url":"https://api.github.com/users/Gh0sty/gists{/gist_id}","starred_url":"https://api.github.com/users/Gh0sty/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Gh0sty/subscriptions","organizations_url":"https://api.github.com/users/Gh0sty/orgs","repos_url":"https://api.github.com/users/Gh0sty/repos","events_url":"https://api.github.com/users/Gh0sty/events{/privacy}","received_events_url":"https://api.github.com/users/Gh0sty/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":3},{"login":"izhirov","id":4157437,"node_id":"MDQ6VXNlcjQxNTc0Mzc=","avatar_url":"https://avatars.githubusercontent.com/u/4157437?v=4","gravatar_id":"","url":"https://api.github.com/users/izhirov","html_url":"https://github.com/izhirov","followers_url":"https://api.github.com/users/izhirov/followers","following_url":"https://api.github.com/users/izhirov/following{/other_user}","gists_url":"https://api.github.com/users/izhirov/gists{/gist_id}","starred_url":"https://api.github.com/users/izhirov/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/izhirov/subscriptions","organizations_url":"https://api.github.com/users/izhirov/orgs","repos_url":"https://api.github.com/users/izhirov/repos","events_url":"https://api.github.com/users/izhirov/events{/privacy}","received_events_url":"https://api.github.com/users/izhirov/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":3},{"login":"sadhil","id":33198213,"node_id":"MDQ6VXNlcjMzMTk4MjEz","avatar_url":"https://avatars.githubusercontent.com/u/33198213?v=4","gravatar_id":"","url":"https://api.github.com/users/sadhil","html_url":"https://github.com/sadhil","followers_url":"https://api.github.com/users/sadhil/followers","following_url":"https://api.github.com/users/sadhil/following{/other_user}","gists_url":"https://api.github.com/users/sadhil/gists{/gist_id}","starred_url":"https://api.github.com/users/sadhil/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/sadhil/subscriptions","organizations_url":"https://api.github.com/users/sadhil/orgs","repos_url":"https://api.github.com/users/sadhil/repos","events_url":"https://api.github.com/users/sadhil/events{/privacy}","received_events_url":"https://api.github.com/users/sadhil/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":3},{"login":"frostiness520","id":8393646,"node_id":"MDQ6VXNlcjgzOTM2NDY=","avatar_url":"https://avatars.githubusercontent.com/u/8393646?v=4","gravatar_id":"","url":"https://api.github.com/users/frostiness520","html_url":"https://github.com/frostiness520","followers_url":"https://api.github.com/users/frostiness520/followers","following_url":"https://api.github.com/users/frostiness520/following{/other_user}","gists_url":"https://api.github.com/users/frostiness520/gists{/gist_id}","starred_url":"https://api.github.com/users/frostiness520/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/frostiness520/subscriptions","organizations_url":"https://api.github.com/users/frostiness520/orgs","repos_url":"https://api.github.com/users/frostiness520/repos","events_url":"https://api.github.com/users/frostiness520/events{/privacy}","received_events_url":"https://api.github.com/users/frostiness520/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":3},{"login":"AlexanderNorup","id":5619812,"node_id":"MDQ6VXNlcjU2MTk4MTI=","avatar_url":"https://avatars.githubusercontent.com/u/5619812?v=4","gravatar_id":"","url":"https://api.github.com/users/AlexanderNorup","html_url":"https://github.com/AlexanderNorup","followers_url":"https://api.github.com/users/AlexanderNorup/followers","following_url":"https://api.github.com/users/AlexanderNorup/following{/other_user}","gists_url":"https://api.github.com/users/AlexanderNorup/gists{/gist_id}","starred_url":"https://api.github.com/users/AlexanderNorup/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AlexanderNorup/subscriptions","organizations_url":"https://api.github.com/users/AlexanderNorup/orgs","repos_url":"https://api.github.com/users/AlexanderNorup/repos","events_url":"https://api.github.com/users/AlexanderNorup/events{/privacy}","received_events_url":"https://api.github.com/users/AlexanderNorup/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":3},{"login":"ahrekul","id":7782142,"node_id":"MDQ6VXNlcjc3ODIxNDI=","avatar_url":"https://avatars.githubusercontent.com/u/7782142?v=4","gravatar_id":"","url":"https://api.github.com/users/ahrekul","html_url":"https://github.com/ahrekul","followers_url":"https://api.github.com/users/ahrekul/followers","following_url":"https://api.github.com/users/ahrekul/following{/other_user}","gists_url":"https://api.github.com/users/ahrekul/gists{/gist_id}","starred_url":"https://api.github.com/users/ahrekul/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ahrekul/subscriptions","organizations_url":"https://api.github.com/users/ahrekul/orgs","repos_url":"https://api.github.com/users/ahrekul/repos","events_url":"https://api.github.com/users/ahrekul/events{/privacy}","received_events_url":"https://api.github.com/users/ahrekul/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":2},{"login":"blueport8","id":11661539,"node_id":"MDQ6VXNlcjExNjYxNTM5","avatar_url":"https://avatars.githubusercontent.com/u/11661539?v=4","gravatar_id":"","url":"https://api.github.com/users/blueport8","html_url":"https://github.com/blueport8","followers_url":"https://api.github.com/users/blueport8/followers","following_url":"https://api.github.com/users/blueport8/following{/other_user}","gists_url":"https://api.github.com/users/blueport8/gists{/gist_id}","starred_url":"https://api.github.com/users/blueport8/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/blueport8/subscriptions","organizations_url":"https://api.github.com/users/blueport8/orgs","repos_url":"https://api.github.com/users/blueport8/repos","events_url":"https://api.github.com/users/blueport8/events{/privacy}","received_events_url":"https://api.github.com/users/blueport8/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":2},{"login":"dependabot[bot]","id":49699333,"node_id":"MDM6Qm90NDk2OTkzMzM=","avatar_url":"https://avatars.githubusercontent.com/in/29110?v=4","gravatar_id":"","url":"https://api.github.com/users/dependabot%5Bbot%5D","html_url":"https://github.com/apps/dependabot","followers_url":"https://api.github.com/users/dependabot%5Bbot%5D/followers","following_url":"https://api.github.com/users/dependabot%5Bbot%5D/following{/other_user}","gists_url":"https://api.github.com/users/dependabot%5Bbot%5D/gists{/gist_id}","starred_url":"https://api.github.com/users/dependabot%5Bbot%5D/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/dependabot%5Bbot%5D/subscriptions","organizations_url":"https://api.github.com/users/dependabot%5Bbot%5D/orgs","repos_url":"https://api.github.com/users/dependabot%5Bbot%5D/repos","events_url":"https://api.github.com/users/dependabot%5Bbot%5D/events{/privacy}","received_events_url":"https://api.github.com/users/dependabot%5Bbot%5D/received_events","type":"Bot","user_view_type":"public","site_admin":false,"contributions":2},{"login":"halcy","id":59633,"node_id":"MDQ6VXNlcjU5NjMz","avatar_url":"https://avatars.githubusercontent.com/u/59633?v=4","gravatar_id":"","url":"https://api.github.com/users/halcy","html_url":"https://github.com/halcy","followers_url":"https://api.github.com/users/halcy/followers","following_url":"https://api.github.com/users/halcy/following{/other_user}","gists_url":"https://api.github.com/users/halcy/gists{/gist_id}","starred_url":"https://api.github.com/users/halcy/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/halcy/subscriptions","organizations_url":"https://api.github.com/users/halcy/orgs","repos_url":"https://api.github.com/users/halcy/repos","events_url":"https://api.github.com/users/halcy/events{/privacy}","received_events_url":"https://api.github.com/users/halcy/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":2},{"login":"bogenpirat","id":1835496,"node_id":"MDQ6VXNlcjE4MzU0OTY=","avatar_url":"https://avatars.githubusercontent.com/u/1835496?v=4","gravatar_id":"","url":"https://api.github.com/users/bogenpirat","html_url":"https://github.com/bogenpirat","followers_url":"https://api.github.com/users/bogenpirat/followers","following_url":"https://api.github.com/users/bogenpirat/following{/other_user}","gists_url":"https://api.github.com/users/bogenpirat/gists{/gist_id}","starred_url":"https://api.github.com/users/bogenpirat/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bogenpirat/subscriptions","organizations_url":"https://api.github.com/users/bogenpirat/orgs","repos_url":"https://api.github.com/users/bogenpirat/repos","events_url":"https://api.github.com/users/bogenpirat/events{/privacy}","received_events_url":"https://api.github.com/users/bogenpirat/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":2},{"login":"vntw","id":502368,"node_id":"MDQ6VXNlcjUwMjM2OA==","avatar_url":"https://avatars.githubusercontent.com/u/502368?v=4","gravatar_id":"","url":"https://api.github.com/users/vntw","html_url":"https://github.com/vntw","followers_url":"https://api.github.com/users/vntw/followers","following_url":"https://api.github.com/users/vntw/following{/other_user}","gists_url":"https://api.github.com/users/vntw/gists{/gist_id}","starred_url":"https://api.github.com/users/vntw/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/vntw/subscriptions","organizations_url":"https://api.github.com/users/vntw/orgs","repos_url":"https://api.github.com/users/vntw/repos","events_url":"https://api.github.com/users/vntw/events{/privacy}","received_events_url":"https://api.github.com/users/vntw/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"patagonaa","id":22572128,"node_id":"MDQ6VXNlcjIyNTcyMTI4","avatar_url":"https://avatars.githubusercontent.com/u/22572128?v=4","gravatar_id":"","url":"https://api.github.com/users/patagonaa","html_url":"https://github.com/patagonaa","followers_url":"https://api.github.com/users/patagonaa/followers","following_url":"https://api.github.com/users/patagonaa/following{/other_user}","gists_url":"https://api.github.com/users/patagonaa/gists{/gist_id}","starred_url":"https://api.github.com/users/patagonaa/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/patagonaa/subscriptions","organizations_url":"https://api.github.com/users/patagonaa/orgs","repos_url":"https://api.github.com/users/patagonaa/repos","events_url":"https://api.github.com/users/patagonaa/events{/privacy}","received_events_url":"https://api.github.com/users/patagonaa/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"kid4rkness","id":8313828,"node_id":"MDQ6VXNlcjgzMTM4Mjg=","avatar_url":"https://avatars.githubusercontent.com/u/8313828?v=4","gravatar_id":"","url":"https://api.github.com/users/kid4rkness","html_url":"https://github.com/kid4rkness","followers_url":"https://api.github.com/users/kid4rkness/followers","following_url":"https://api.github.com/users/kid4rkness/following{/other_user}","gists_url":"https://api.github.com/users/kid4rkness/gists{/gist_id}","starred_url":"https://api.github.com/users/kid4rkness/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/kid4rkness/subscriptions","organizations_url":"https://api.github.com/users/kid4rkness/orgs","repos_url":"https://api.github.com/users/kid4rkness/repos","events_url":"https://api.github.com/users/kid4rkness/events{/privacy}","received_events_url":"https://api.github.com/users/kid4rkness/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"ken2812221","id":11154118,"node_id":"MDQ6VXNlcjExMTU0MTE4","avatar_url":"https://avatars.githubusercontent.com/u/11154118?v=4","gravatar_id":"","url":"https://api.github.com/users/ken2812221","html_url":"https://github.com/ken2812221","followers_url":"https://api.github.com/users/ken2812221/followers","following_url":"https://api.github.com/users/ken2812221/following{/other_user}","gists_url":"https://api.github.com/users/ken2812221/gists{/gist_id}","starred_url":"https://api.github.com/users/ken2812221/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ken2812221/subscriptions","organizations_url":"https://api.github.com/users/ken2812221/orgs","repos_url":"https://api.github.com/users/ken2812221/repos","events_url":"https://api.github.com/users/ken2812221/events{/privacy}","received_events_url":"https://api.github.com/users/ken2812221/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"jiihwan","id":17541950,"node_id":"MDQ6VXNlcjE3NTQxOTUw","avatar_url":"https://avatars.githubusercontent.com/u/17541950?v=4","gravatar_id":"","url":"https://api.github.com/users/jiihwan","html_url":"https://github.com/jiihwan","followers_url":"https://api.github.com/users/jiihwan/followers","following_url":"https://api.github.com/users/jiihwan/following{/other_user}","gists_url":"https://api.github.com/users/jiihwan/gists{/gist_id}","starred_url":"https://api.github.com/users/jiihwan/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jiihwan/subscriptions","organizations_url":"https://api.github.com/users/jiihwan/orgs","repos_url":"https://api.github.com/users/jiihwan/repos","events_url":"https://api.github.com/users/jiihwan/events{/privacy}","received_events_url":"https://api.github.com/users/jiihwan/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"gamercool57","id":32177692,"node_id":"MDQ6VXNlcjMyMTc3Njky","avatar_url":"https://avatars.githubusercontent.com/u/32177692?v=4","gravatar_id":"","url":"https://api.github.com/users/gamercool57","html_url":"https://github.com/gamercool57","followers_url":"https://api.github.com/users/gamercool57/followers","following_url":"https://api.github.com/users/gamercool57/following{/other_user}","gists_url":"https://api.github.com/users/gamercool57/gists{/gist_id}","starred_url":"https://api.github.com/users/gamercool57/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/gamercool57/subscriptions","organizations_url":"https://api.github.com/users/gamercool57/orgs","repos_url":"https://api.github.com/users/gamercool57/repos","events_url":"https://api.github.com/users/gamercool57/events{/privacy}","received_events_url":"https://api.github.com/users/gamercool57/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"defroll","id":4403841,"node_id":"MDQ6VXNlcjQ0MDM4NDE=","avatar_url":"https://avatars.githubusercontent.com/u/4403841?v=4","gravatar_id":"","url":"https://api.github.com/users/defroll","html_url":"https://github.com/defroll","followers_url":"https://api.github.com/users/defroll/followers","following_url":"https://api.github.com/users/defroll/following{/other_user}","gists_url":"https://api.github.com/users/defroll/gists{/gist_id}","starred_url":"https://api.github.com/users/defroll/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/defroll/subscriptions","organizations_url":"https://api.github.com/users/defroll/orgs","repos_url":"https://api.github.com/users/defroll/repos","events_url":"https://api.github.com/users/defroll/events{/privacy}","received_events_url":"https://api.github.com/users/defroll/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"TheLongLife","id":10586628,"node_id":"MDQ6VXNlcjEwNTg2NjI4","avatar_url":"https://avatars.githubusercontent.com/u/10586628?v=4","gravatar_id":"","url":"https://api.github.com/users/TheLongLife","html_url":"https://github.com/TheLongLife","followers_url":"https://api.github.com/users/TheLongLife/followers","following_url":"https://api.github.com/users/TheLongLife/following{/other_user}","gists_url":"https://api.github.com/users/TheLongLife/gists{/gist_id}","starred_url":"https://api.github.com/users/TheLongLife/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/TheLongLife/subscriptions","organizations_url":"https://api.github.com/users/TheLongLife/orgs","repos_url":"https://api.github.com/users/TheLongLife/repos","events_url":"https://api.github.com/users/TheLongLife/events{/privacy}","received_events_url":"https://api.github.com/users/TheLongLife/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"Stargamers","id":12717513,"node_id":"MDQ6VXNlcjEyNzE3NTEz","avatar_url":"https://avatars.githubusercontent.com/u/12717513?v=4","gravatar_id":"","url":"https://api.github.com/users/Stargamers","html_url":"https://github.com/Stargamers","followers_url":"https://api.github.com/users/Stargamers/followers","following_url":"https://api.github.com/users/Stargamers/following{/other_user}","gists_url":"https://api.github.com/users/Stargamers/gists{/gist_id}","starred_url":"https://api.github.com/users/Stargamers/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Stargamers/subscriptions","organizations_url":"https://api.github.com/users/Stargamers/orgs","repos_url":"https://api.github.com/users/Stargamers/repos","events_url":"https://api.github.com/users/Stargamers/events{/privacy}","received_events_url":"https://api.github.com/users/Stargamers/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1},{"login":"chrisheib","id":6112968,"node_id":"MDQ6VXNlcjYxMTI5Njg=","avatar_url":"https://avatars.githubusercontent.com/u/6112968?v=4","gravatar_id":"","url":"https://api.github.com/users/chrisheib","html_url":"https://github.com/chrisheib","followers_url":"https://api.github.com/users/chrisheib/followers","following_url":"https://api.github.com/users/chrisheib/following{/other_user}","gists_url":"https://api.github.com/users/chrisheib/gists{/gist_id}","starred_url":"https://api.github.com/users/chrisheib/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/chrisheib/subscriptions","organizations_url":"https://api.github.com/users/chrisheib/orgs","repos_url":"https://api.github.com/users/chrisheib/repos","events_url":"https://api.github.com/users/chrisheib/events{/privacy}","received_events_url":"https://api.github.com/users/chrisheib/received_events","type":"User","user_view_type":"public","site_admin":false,"contributions":1}];
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
  'use strict';

  /**
   * Class for managing events.
   * Can be extended to provide event functionality in other classes.
   *
   * @class EventEmitter Manages event registering and emitting.
   */
  function EventEmitter() {}

  // Shortcuts to improve speed and size
  var proto = EventEmitter.prototype;
  var exports = this;
  var originalGlobalValue = exports.EventEmitter;

  /**
   * Finds the index of the listener for the event in its storage array.
   *
   * @param {Function[]} listeners Array of listeners to search through.
   * @param {Function} listener Method to look for.
   * @return {Number} Index of the specified listener, -1 if not found
   * @api private
   */
  function indexOfListener(listeners, listener) {
    var i = listeners.length;
    while (i--) {
      if (listeners[i].listener === listener) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Alias a method while keeping the context correct, to allow for overwriting of target method.
   *
   * @param {String} name The name of the target method.
   * @return {Function} The aliased method
   * @api private
   */
  function alias(name) {
    return function aliasClosure() {
      return this[name].apply(this, arguments);
    };
  }

  /**
   * Returns the listener array for the specified event.
   * Will initialise the event object and listener arrays if required.
   * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
   * Each property in the object response is an array of listener functions.
   *
   * @param {String|RegExp} evt Name of the event to return the listeners from.
   * @return {Function[]|Object} All listener functions for the event.
   */
  proto.getListeners = function getListeners(evt) {
    var events = this._getEvents();
    var response;
    var key;

    // Return a concatenated array of all matching events if
    // the selector is a regular expression.
    if (evt instanceof RegExp) {
      response = {};
      for (key in events) {
        if (events.hasOwnProperty(key) && evt.test(key)) {
          response[key] = events[key];
        }
      }
    }
    else {
      response = events[evt] || (events[evt] = []);
    }

    return response;
  };

  /**
   * Takes a list of listener objects and flattens it into a list of listener functions.
   *
   * @param {Object[]} listeners Raw listener objects.
   * @return {Function[]} Just the listener functions.
   */
  proto.flattenListeners = function flattenListeners(listeners) {
    var flatListeners = [];
    var i;

    for (i = 0; i < listeners.length; i += 1) {
      flatListeners.push(listeners[i].listener);
    }

    return flatListeners;
  };

  /**
   * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
   *
   * @param {String|RegExp} evt Name of the event to return the listeners from.
   * @return {Object} All listener functions for an event in an object.
   */
  proto.getListenersAsObject = function getListenersAsObject(evt) {
    var listeners = this.getListeners(evt);
    var response;

    if (listeners instanceof Array) {
      response = {};
      response[evt] = listeners;
    }

    return response || listeners;
  };

  /**
   * Adds a listener function to the specified event.
   * The listener will not be added if it is a duplicate.
   * If the listener returns true then it will be removed after it is called.
   * If you pass a regular expression as the event name then the listener will be added to all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to attach the listener to.
   * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.addListener = function addListener(evt, listener) {
    var listeners = this.getListenersAsObject(evt);
    var listenerIsWrapped = typeof listener === 'object';
    var key;

    for (key in listeners) {
      if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
        listeners[key].push(listenerIsWrapped ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  };

  /**
   * Alias of addListener
   */
  proto.on = alias('addListener');

  /**
   * Semi-alias of addListener. It will add a listener that will be
   * automatically removed after its first execution.
   *
   * @param {String|RegExp} evt Name of the event to attach the listener to.
   * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.addOnceListener = function addOnceListener(evt, listener) {
    return this.addListener(evt, {
      listener: listener,
      once: true
    });
  };

  /**
   * Alias of addOnceListener.
   */
  proto.once = alias('addOnceListener');

  /**
   * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
   * You need to tell it what event names should be matched by a regex.
   *
   * @param {String} evt Name of the event to create.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.defineEvent = function defineEvent(evt) {
    this.getListeners(evt);
    return this;
  };

  /**
   * Uses defineEvent to define multiple events.
   *
   * @param {String[]} evts An array of event names to define.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.defineEvents = function defineEvents(evts) {
    for (var i = 0; i < evts.length; i += 1) {
      this.defineEvent(evts[i]);
    }
    return this;
  };

  /**
   * Removes a listener function from the specified event.
   * When passed a regular expression as the event name, it will remove the listener from all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to remove the listener from.
   * @param {Function} listener Method to remove from the event.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.removeListener = function removeListener(evt, listener) {
    var listeners = this.getListenersAsObject(evt);
    var index;
    var key;

    for (key in listeners) {
      if (listeners.hasOwnProperty(key)) {
        index = indexOfListener(listeners[key], listener);

        if (index !== -1) {
          listeners[key].splice(index, 1);
        }
      }
    }

    return this;
  };

  /**
   * Alias of removeListener
   */
  proto.off = alias('removeListener');

  /**
   * Adds listeners in bulk using the manipulateListeners method.
   * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
   * You can also pass it a regular expression to add the array of listeners to all events that match it.
   * Yeah, this function does quite a bit. That's probably a bad thing.
   *
   * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
   * @param {Function[]} [listeners] An optional array of listener functions to add.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.addListeners = function addListeners(evt, listeners) {
    // Pass through to manipulateListeners
    return this.manipulateListeners(false, evt, listeners);
  };

  /**
   * Removes listeners in bulk using the manipulateListeners method.
   * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
   * You can also pass it an event name and an array of listeners to be removed.
   * You can also pass it a regular expression to remove the listeners from all events that match it.
   *
   * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
   * @param {Function[]} [listeners] An optional array of listener functions to remove.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.removeListeners = function removeListeners(evt, listeners) {
    // Pass through to manipulateListeners
    return this.manipulateListeners(true, evt, listeners);
  };

  /**
   * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
   * The first argument will determine if the listeners are removed (true) or added (false).
   * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
   * You can also pass it an event name and an array of listeners to be added/removed.
   * You can also pass it a regular expression to manipulate the listeners of all events that match it.
   *
   * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
   * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
   * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
    var i;
    var value;
    var single = remove ? this.removeListener : this.addListener;
    var multiple = remove ? this.removeListeners : this.addListeners;

    // If evt is an object then pass each of its properties to this method
    if (typeof evt === 'object' && !(evt instanceof RegExp)) {
      for (i in evt) {
        if (evt.hasOwnProperty(i) && (value = evt[i])) {
          // Pass the single listener straight through to the singular method
          if (typeof value === 'function') {
            single.call(this, i, value);
          }
          else {
            // Otherwise pass back to the multiple function
            multiple.call(this, i, value);
          }
        }
      }
    }
    else {
      // So evt must be a string
      // And listeners must be an array of listeners
      // Loop over it and pass each one to the multiple method
      i = listeners.length;
      while (i--) {
        single.call(this, evt, listeners[i]);
      }
    }

    return this;
  };

  /**
   * Removes all listeners from a specified event.
   * If you do not specify an event then all listeners will be removed.
   * That means every event will be emptied.
   * You can also pass a regex to remove all events that match it.
   *
   * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.removeEvent = function removeEvent(evt) {
    var type = typeof evt;
    var events = this._getEvents();
    var key;

    // Remove different things depending on the state of evt
    if (type === 'string') {
      // Remove all listeners for the specified event
      delete events[evt];
    }
    else if (evt instanceof RegExp) {
      // Remove all events matching the regex.
      for (key in events) {
        if (events.hasOwnProperty(key) && evt.test(key)) {
          delete events[key];
        }
      }
    }
    else {
      // Remove all listeners in all events
      delete this._events;
    }

    return this;
  };

  /**
   * Alias of removeEvent.
   *
   * Added to mirror the node API.
   */
  proto.removeAllListeners = alias('removeEvent');

  /**
   * Emits an event of your choice.
   * When emitted, every listener attached to that event will be executed.
   * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
   * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
   * So they will not arrive within the array on the other side, they will be separate.
   * You can also pass a regular expression to emit to all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
   * @param {Array} [args] Optional array of arguments to be passed to each listener.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.emitEvent = function emitEvent(evt, args) {
    var listeners = this.getListenersAsObject(evt);
    var listener;
    var i;
    var key;
    var response;

    for (key in listeners) {
      if (listeners.hasOwnProperty(key)) {
        i = listeners[key].length;

        while (i--) {
          // If the listener returns true then it shall be removed from the event
          // The function is executed either with a basic call or an apply if there is an args array
          listener = listeners[key][i];

          if (listener.once === true) {
            this.removeListener(evt, listener.listener);
          }

          response = listener.listener.apply(this, args || []);

          if (response === this._getOnceReturnValue()) {
            this.removeListener(evt, listener.listener);
          }
        }
      }
    }

    return this;
  };

  /**
   * Alias of emitEvent
   */
  proto.trigger = alias('emitEvent');

  /**
   * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
   * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
   * @param {...*} Optional additional arguments to be passed to each listener.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.emit = function emit(evt) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.emitEvent(evt, args);
  };

  /**
   * Sets the current value to check against when executing listeners. If a
   * listeners return value matches the one set here then it will be removed
   * after execution. This value defaults to true.
   *
   * @param {*} value The new value to check for when executing listeners.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  proto.setOnceReturnValue = function setOnceReturnValue(value) {
    this._onceReturnValue = value;
    return this;
  };

  /**
   * Fetches the current value to check against when executing listeners. If
   * the listeners return value matches this one then it should be removed
   * automatically. It will return true by default.
   *
   * @return {*|Boolean} The current value to check for or the default, true.
   * @api private
   */
  proto._getOnceReturnValue = function _getOnceReturnValue() {
    if (this.hasOwnProperty('_onceReturnValue')) {
      return this._onceReturnValue;
    }
    else {
      return true;
    }
  };

  /**
   * Fetches the events object and creates one if required.
   *
   * @return {Object} The events storage object.
   * @api private
   */
  proto._getEvents = function _getEvents() {
    return this._events || (this._events = {});
  };

  /**
   * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
   *
   * @return {Function} Non conflicting EventEmitter class.
   */
  EventEmitter.noConflict = function noConflict() {
    exports.EventEmitter = originalGlobalValue;
    return EventEmitter;
  };

  // Expose the class either via AMD, CommonJS or the global object
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return EventEmitter;
    });
  }
  else if (typeof module === 'object' && module.exports){
    module.exports = EventEmitter;
  }
  else {
    exports.EventEmitter = EventEmitter;
  }
}.call(this));
// Service Worker compatible utilities
(function() {
  const that = {};
  const CHROME = "chrome";
  
  that.rbrowser = CHROME;

  const _browserAction = that.browserAction = {};
  _browserAction.setBadgeText = function(opts) {
    if (chrome.action && chrome.action.setBadgeText) {
      chrome.action.setBadgeText(opts);
    }
  };

  const _runtime = that.runtime = {};
  _runtime.getURL = function(path) {
    return chrome.runtime.getURL(path);
  };

  const _notifications = that.notifications = {};
  _notifications.richNotificationsSupported = function() {
    return !!(chrome.notifications && chrome.notifications.create);
  };

  if (typeof self !== 'undefined') {
    self.utils = that;
  }

}).call(this);
// Service Worker compatible OAuth2 implementation
(function () {
  const that = {};

  function noop() {}

  that._adapters = {};

  const request = function (opts, callback) {
    const fetchOptions = {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if (opts.data && opts.method === 'POST') {
      if (typeof opts.data === 'object') {
        const params = new URLSearchParams();
        for (const key in opts.data) {
          params.append(key, opts.data[key]);
        }
        fetchOptions.body = params.toString();
      } else {
        fetchOptions.body = opts.data;
      }
    }

    fetch(opts.url, fetchOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => callback(null, data))
      .catch(err => callback(err));
  };

  const Adapter = function (id, opts, flow) {
    this.lsPath = "oauth2_" + id;
    this.opts = opts;
    this.responseType = this.opts.response_type;
    this.flowType = flow || "codeflow";
    this.apiBase = opts.api;
    this.clientId = opts.client_id;
    this.clientSecret = opts.client_secret;
    this.scope = opts.scope;
    this.redirectUri = opts.redirect_uri;
  };

  Adapter.prototype.getData = async function() {
    return bgApp.get(this.lsPath);
  };

  Adapter.prototype.setData = async function(data) {
    return bgApp.set(this.lsPath, data);
  };

  Adapter.prototype.removeData = async function() {
    return bgApp.del(this.lsPath);
  };

  Adapter.prototype.isAuthorized = async function() {
    const data = await this.getData();
    return !!(data && data.access_token);
  };

  Adapter.prototype.getAccessToken = async function() {
    const data = await this.getData();
    return data ? data.access_token : null;
  };

  Adapter.prototype.authorize = function(callback) {
    callback = callback || noop;
    
    const url = this.apiBase + 
      "?client_id=" + encodeURIComponent(this.clientId) +
      "&redirect_uri=" + encodeURIComponent(this.redirectUri) +
      "&response_type=" + encodeURIComponent(this.responseType) +
      "&scope=" + encodeURIComponent(this.scope);

    chrome.tabs.create({ url: url }, (tab) => {
      const checkTab = () => {
        chrome.tabs.get(tab.id, (currentTab) => {
          if (chrome.runtime.lastError) {
            callback(new Error("Authorization cancelled"));
            return;
          }
          
          if (currentTab && currentTab.url && currentTab.url.includes(this.redirectUri)) {
            const urlParams = new URLSearchParams(currentTab.url.split('#')[1] || '');
            const accessToken = urlParams.get('access_token');
            
            if (accessToken) {
              const tokenData = {
                access_token: accessToken,
                token_type: urlParams.get('token_type'),
                scope: urlParams.get('scope')
              };
              
              this.setData(tokenData).then(() => {
                chrome.tabs.remove(tab.id);
                callback(null, tokenData);
              });
            } else {
              callback(new Error("No access token received"));
            }
          } else {
            setTimeout(checkTab, 1000);
          }
        });
      };
      
      checkTab();
    });
  };

  that.addAdapter = function(config) {
    
    const id = config.id;
    const opts = config.opts;
    const flow = config.codeflow;
    
    
    const adapter = new Adapter(id, opts, flow);
    that._adapters[id] = adapter;
    return adapter;
  };

  if (typeof self !== 'undefined') {
    self.OAuth2 = that;
  }
  
  if (typeof globalThis !== 'undefined') {
    globalThis.OAuth2 = that;
  }

}).call(self);
// Service Worker compatible Twitch API client
(function() {
  "use strict";

  const TwitchApi = function(clientId) {
    if (!clientId) throw new Error("clientId is required");
    this.basePath = "https://api.twitch.tv/helix";
    this.userName = "";
    this.userId = "";
    this.clientId = clientId;
    this.timeout = 10 * 1000;
    this.token = "";
    this._events = {};
  };

  TwitchApi.prototype.on = function(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
  };

  TwitchApi.prototype.trigger = function(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach(callback => callback(...args));
    }
  };

  TwitchApi.prototype.isAuthorized = function() {
    return !!this.token;
  };

  TwitchApi.prototype.authorize = function() {
    if (typeof twitchOauth !== 'undefined') {
      twitchOauth.authorize(() => {});
    }
  };

  TwitchApi.prototype.revoke = function() {
    if (this.token && this.token.length > 0 && typeof twitchOauth !== 'undefined') {
      twitchOauth.removeData();
    }
  };

  TwitchApi.prototype.getRequestParams = function() {
    return {
      timeout: this.timeout,
      headers: {
        "Accept": "application/json",
        "Client-ID": this.clientId,
        "Authorization": "Bearer " + this.token
      }
    };
  };

  TwitchApi.prototype.setToken = function(accessToken) {
    this.token = accessToken;
    this.trigger("tokenchange", accessToken);
  };

  TwitchApi.prototype.processStreamThumbnails = function(data) {
    if (data && data.data && data.data.length) {
      data.data = data.data.map(function(s) {
        if (s.thumbnail_url && typeof s.thumbnail_url === 'string') {
          s.thumbnail_url = s.thumbnail_url.replace(/{width}/, 134);
          s.thumbnail_url = s.thumbnail_url.replace(/{height}/, 70);
        }
        return s;
      });
    }
    return data;
  };

  TwitchApi.prototype.send = async function(endpoint, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    const requestParams = this.getRequestParams();
    let url = `${this.basePath}/${endpoint}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
      }
      url += '?' + searchParams.toString();
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: requestParams.headers,
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Note: We can't directly access twitchOauth here, so we'll throw a specific error
          throw new Error(`HTTP 401: Token expired or invalid`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (callback) callback(null, data);
      return data;
    } catch (err) {
      console.error('Twitch API error:', err);
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getUserInfo = async function(callback) {
    if (!this.token) {
      const error = new Error('Not authorized - no token');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('users');
      if (data && data.data && data.data[0]) {
        this.userId = data.data[0].id;
        this.userName = data.data[0].display_name;
        if (callback) callback(null, data.data[0]);
        return data.data[0];
      } else {
        const error = new Error('Invalid user data received');
        if (callback) callback(error);
        throw error;
      }
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getFollowedStreams = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    if (!this.userId) {
      try {
        await this.getUserInfo();
      } catch (err) {
        if (callback) callback(err);
        throw err;
      }
    }

    try {
      const data = await this.send('streams/followed', { user_id: this.userId });
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getTopGames = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('games/top');
      
      if (data && data.data) {
        data.data = Array.isArray(data.data) ? data.data : [];
        data.data.forEach(function (g) {
          g.box_art_url = g.box_art_url.replace(/{width}/, 136);
          g.box_art_url = g.box_art_url.replace(/{height}/, 190);
        });
      }
      
      if (callback) callback(null, data);
      return data;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getGameStreams = async function(gameId, callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    if (!gameId) {
      const error = new Error('Game ID is required');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('streams', { game_id: gameId });
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getTopStreams = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('streams');
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.searchStreams = async function(searchQuery, callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    if (!searchQuery) {
      const error = new Error('Search query is required');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('search/channels', { query: searchQuery });
      
      if (data && data.data) {
        const liveChannels = data.data.filter(channel => channel.is_live);
        
        const transformedStreams = liveChannels.map(channel => ({
          id: channel.id,
          user_id: channel.id,
          user_name: channel.broadcaster_login,
          user_login: channel.broadcaster_login,
          game_id: channel.game_id,
          game_name: channel.game_name,
          type: 'live',
          title: channel.title,
          viewer_count: 0, // Channel search doesn't provide viewer count
          started_at: channel.started_at || new Date().toISOString(),
          language: channel.broadcaster_language || 'en',
          thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.broadcaster_login}-{width}x{height}.jpg`,
          tag_ids: [],
          is_mature: false,
          name: channel.display_name,
          display_name: channel.display_name,
          profile_image_url: ''
        }));
        
        const processedData = {
          data: transformedStreams,
          pagination: data.pagination || {}
        };
        
        const finalData = this.processStreamThumbnails(processedData);
        
        if (callback) callback(null, finalData);
        return finalData;
      } else {
        const emptyData = { data: [], pagination: {} };
        if (callback) callback(null, emptyData);
        return emptyData;
      }
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  if (typeof self !== 'undefined') {
    self.TwitchApi = TwitchApi;
  }

}).call(this);
// Service Worker compatible error handling
(function() {
  
  // Replace window.onerror with service worker error handling
  self.addEventListener('error', function(event) {
    const msg = event.message || 'Unknown error';
    const filename = event.filename || 'unknown';
    const line = event.lineno || 0;
    const column = event.colno || 0;
    
    console.error(`Service Worker Error: ${msg} at ${filename}:${line}:${column}`);
    
    // Optional: Send error report to background analytics
    // but avoid external dependencies in service worker
  });

  self.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default handling (which would log to console)
    event.preventDefault();
  });

})();
// Twitch Now - Minimal Service Worker for Manifest V3
// Contains only essential background functionality

console.log('[SW] Service Worker script loaded');

const bgApp = {};
bgApp.notificationIds = {};


bgApp.get = async function(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => {
      resolve(result[key]);
    });
  });
};

bgApp.set = async function(key, val) {
  return new Promise(resolve => {
    chrome.storage.local.set({[key]: val}, () => {
      resolve();
    });
  });
};

bgApp.del = async function(...keys) {
  return new Promise(resolve => {
    chrome.storage.local.remove(keys, () => {
      resolve();
    });
  });
};

bgApp.setBadge = function(text) {
  text += "";
  text = text === "0" ? "" : text;
  chrome.action.setBadgeText({
    text: text
  });
};

bgApp.clearBadge = function() {
  bgApp.setBadge("");
};

bgApp.richNotificationsSupported = function() {
  return chrome.notifications && chrome.notifications.create;
};

bgApp.bindNotificationListeners = function() {
  if (bgApp.richNotificationsSupported()) {
    chrome.notifications.onClicked.addListener(function(notificationId) {
      const streamData = bgApp.notificationIds[notificationId];
      if (streamData) {
        chrome.tabs.create({
          url: `https://www.twitch.tv/${streamData.name}`
        });
      }
      chrome.notifications.clear(notificationId);
    });

    chrome.notifications.onClosed.addListener(function(notificationId, byUser) {
      delete bgApp.notificationIds[notificationId];
    });
  }
};

bgApp.downloadImageAsBlob = async function(url, type) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to download image:', err);
    return chrome.runtime.getURL("common/icons/64_1.png");
  }
};

// Send desktop notifications for new streams
bgApp.sendNotification = async function(streamList) {
  if (!bgApp.richNotificationsSupported() || !streamList || streamList.length === 0) {
    return;
  }

  const displayCount = await bgApp.get("notifyCount") || 3;
  const defaultIcon = chrome.runtime.getURL("common/icons/64_1.png");
  const streamsToShow = streamList.slice(0, displayCount);
  const streamsOther = streamList.slice(displayCount);

  let delay = 0;
  
  for (let i = 0; i < streamsToShow.length; i++) {
    const stream = streamsToShow[i];
    const notificationId = `TwitchNow.Notification.${Date.now()}.${i}`;
    
    let iconUrl = defaultIcon;
    try {
      if (stream.profile_image_url) {
        iconUrl = await bgApp.downloadImageAsBlob(stream.profile_image_url, "image/png");
      }
    } catch (e) {
    }

    const opt = {
      type: "basic",
      title: stream.name,
      message: `${stream.game_name || 'Just Chatting'}\n${stream.title || 'No title'}`,
      iconUrl: iconUrl
    };

    bgApp.notificationIds[notificationId] = stream;
    
    setTimeout(() => {
      chrome.notifications.create(notificationId, opt);
    }, delay);
    
    delay += 1000;
  }

  if (streamsOther.length > 0) {
    const notificationId = `TwitchNow.Notification.${Date.now()}.summary`;
    const streamNames = streamsOther.map(s => s.name).slice(0, 3);
    
    let message;
    if (streamsOther.length > 3) {
      message = `${streamNames.slice(0, 2).join('\n')}\nand ${streamsOther.length - 2} more streamers are live`;
    } else {
      message = streamNames.join('\n');
    }

    const opt = {
      type: "basic", 
      title: "Twitch Now",
      message: message,
      iconUrl: defaultIcon
    };

    setTimeout(() => {
      chrome.notifications.create(notificationId, opt);
    }, delay);
  }
};

// Basic stream monitoring
bgApp.checkForNewStreams = async function() {
  try {
    
    const accessToken = await twitchOauth.getAccessToken();
    if (!accessToken) {
      return;
    }
    
    twitchApi.setToken(accessToken);
    
    twitchApi.getFollowedStreams(async (error, data) => {
      if (bgApp.handleAuthError(error)) return; // DRY auth handling
      if (error) {
        console.error('[SW] Error fetching followed streams in background:', error);
        return;
      }
      
      const streamCount = data && data.data ? data.data.length : 0;
      
      const settings = await bgApp.get('settings') || [];
      const showBadgeSetting = settings.find(s => s.id === 'showBadge');
      const showBadge = showBadgeSetting ? showBadgeSetting.value : true; // Default to true
      
      if (showBadge) {
        bgApp.setBadge(streamCount);
      } else {
        bgApp.clearBadge();
      }
      
      chrome.runtime.sendMessage({
        type: 'BACKGROUND_STREAMS_UPDATED',
        streamCount: streamCount,
        streams: data && data.data ? data.data : []
      }, (response) => {
        if (chrome.runtime.lastError) {
        }
      });
    });
    
  } catch (err) {
    console.error('[SW] Failed to check for new streams:', err);
  }
};

bgApp.startPeriodicChecking = function() {
  chrome.alarms.create('checkStreams', {
    delayInMinutes: 0.1, // First check in 6 seconds (0.1 minutes)
    periodInMinutes: 5 // Check every 5 minutes after that
  });
};

// Centralized auth error handler
bgApp.handleAuthError = function(error) {
  if (error && error.message && error.message.includes('401')) {
    
    if (typeof twitchOauth !== 'undefined') {
      twitchOauth.removeData();
    }
    
    bgApp.clearBadge();
    
    chrome.runtime.sendMessage({
      type: 'AUTH_EXPIRED'
    }, (response) => {
      if (chrome.runtime.lastError) {
      }
    });
    
    return true; // Indicates auth error was handled
  }
  return false; // Not an auth error
};

const twitchOauth = OAuth2.addAdapter({
  id: 'twitch',
  opts: constants.twitchApi,
  codeflow: {
    method: "POST",
    url: "https://api.twitch.tv/kraken/oauth2/token"
  }
});

const twitchApi = new TwitchApi(constants.twitchApi.client_id);

// Initialize service worker
bgApp.init = function() {
  console.log('[SW] Service worker initializing...');
  
  bgApp.bindNotificationListeners();
  bgApp.startPeriodicChecking();
  
  bgApp.checkForNewStreams();
};


chrome.runtime.onStartup.addListener(() => {
  bgApp.init();
});

chrome.runtime.onInstalled.addListener(() => {
  bgApp.init();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStreams') {
    bgApp.checkForNewStreams();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_LIVE_STREAMS':
      sendResponse({status: 'ok'});
      break;
      
    case 'STREAMS_UPDATED':
      const { liveCount, newStreams } = message;
      bgApp.setBadge(liveCount);
      
      if (newStreams && newStreams.length > 0) {
        bgApp.sendNotification(newStreams);
      }
      break;
      
    case 'SET_BADGE':
      bgApp.setBadge(message.text);
      break;
      
    case 'CLEAR_BADGE':
      bgApp.clearBadge();
      break;
      
    case 'SEND_NOTIFICATION':
      if (message.streams && message.streams.length > 0) {
        bgApp.sendNotification(message.streams);
      }
      break;
      
    case 'IS_AUTHORIZED':
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.isAuthorized().then(authorized => {
          sendResponse({ authorized: authorized });
        }).catch((error) => {
          sendResponse({ authorized: false });
        });
      } else {
        sendResponse({ authorized: false });
      }
      return true; // Keep message channel open for async response
      
    case 'AUTHORIZE':
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.authorize((error, tokenData) => {
        });
      }
      break;
      
    case 'REVOKE':
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.removeData();
      }
      break;
      
    case 'GET_FOLLOWED_STREAMS':
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          twitchApi.getFollowedStreams((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get followed streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_TOP_GAMES':
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          twitchApi.getTopGames((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get top games'
              });
            } else {
              sendResponse({
                status: 'ok',
                games: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_GAME_STREAMS':
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          twitchApi.getGameStreams(message.gameId, (error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get game streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_TOP_STREAMS':
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          twitchApi.getTopStreams((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get top streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'SEARCH_STREAMS':
      if (!message.query) {
        sendResponse({
          status: 'error',
          error: 'Search query is required'
        });
        return;
      }
      
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to search streams
          twitchApi.searchStreams(message.query, (error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to search streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_USER_INFO':
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to get user info
          twitchApi.getUserInfo((error, userData) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get user info'
              });
            } else {
              sendResponse({
                status: 'ok',
                user: userData || {}
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
  }
});

// Initialize on load
bgApp.init();;