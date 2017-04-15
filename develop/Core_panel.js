var PM, audio;

func.is_allowed()
    .then(function (User) {
        PM = func.createModel(User.plugins[0].data);
        PM.Init(User);

        for (var i = 1, len = User.plugins.length; i < len; i++) {
            PM.AddPlugin(func.createModel(User.plugins[i].data));
        }
        User = null;

        PM.Complete();
    })
    .catch(func.errorLog);
