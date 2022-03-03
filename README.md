<div align="center">
  <img src="https://github.com/TonyDeplanque/strapi-plugin-migrations/raw/main/docs/img/logo.svg" width="20%">
<h1>Strapi plugin migrations</h1>
</div>

### ⚠️ The current version of this plugin is working for Strapi v4.

If you want to initialize or update automatically your data in Strapi for all of your environments, this plugin is made for you.

## ⏳ Installation

```bash
# with npm
npm i strapi-plugin-migrations
# with yarn
yarn add strapi-plugin-migrations
```

## 🔧 Configuration

Create the "migrations" folder in the Strapi project root or set the environment variable MIGRATION_FOLDER_PATH which is the path to your files migration folder.

Configure the plugin to your Strapi from `./config/plugins.js`
```javascript
// ./config/plugins.js
module.exports = {
  'migrations': {
    enabled: true,
    config: {
      autoStart: true,
      migrationFolderPath : 'migrations'
    },
  },
}
```

Variables

| Variable            | Description                                            | Default      |
|:--------------------|:-------------------------------------------------------|:-------------|
| autoStart           | For auto start migrations when Strapi start or restart | false        |
| migrationFolderPath | Path to migrations files                               | 'migrations' |


If you don't use autoStart your can call migrations where you want from this method : 

```javascript
await strapi.plugin('migrations').service('migrations').migrations()
```

## 💡 Why use it ?

Currently, with Strapi, the only way to initialize your data is to use bootstrap files, but they are launched on every reboot.
Bootstraps are problematic when you want to edit existing data, such as email_reset_password.

In the native strapi code, the initialization of this data is as follows:

```javascript
const pluginStore = strapi.store({
  environment: '',
  type: 'plugin',
  name: 'users-permissions',
});

if (!(await pluginStore.get({ key: 'advanced' }))) {
  const value = {
    unique_email: true,
    allow_register: true,
    email_confirmation: false,
    email_reset_password: null,
    email_confirmation_redirection: null,
    default_role: 'authenticated',
  };

  await pluginStore.set({ key: 'advanced', value });
}
```

So, on your project, if you want to change the value of the email_reset_password  you'll want to do this:

```javascript
const pluginStore = strapi.store({
  environment: '',
  type: 'plugin',
  name: 'users-permissions',
});

const values = await pluginStore.get({ key: 'advanced' });
if (values) {
  values.email_reset_password = strapi.config.custom.FRONT_URL + ‘/reset-password’
  await pluginStore.set({ key: 'advanced', value: values });
}
```

By doing this, if you change the email_reset_password value in the Strapi's admin and restart your server,
the value you have saved will always be overwritten by the contents of your bootstrap. Which is a problem because Strapi is a CMS, the admin must be master of the data.

To counter this problem, you can use this plugin, which has a javascript file versioning system. It allows you to play code only once, even after restarting the server several times.

## 💪 Usage

```bash
/migrations
  /v1_edit_reset_password_url.js
  /v2_create_roles.js
```

Your migrations files must start with the letter `v` and `a number`  and must be a javascript file.

The files are executed in ascending order, so the `v1_edit_reset_password_url.js` will be played before `v2_create_roles.js`

Once the v1 and v2 files have been executed, they will never be played by Strapi again.

You can show the migration progress in your terminal during start or restart Strapi. You can see your current migration version thanks to the url `<your-strapi-url>/admin/settings/migrations`


## 🥊 Example

You want to update automatically the reset password url for all Strapi environments.
For that, you will create a javascript file in your `migrations` folder which start by `v1` like that `v1_edit_reset_password_url.js`
```bash
/migrations
  /v1_edit_reset_password_url.js
```

You put your code to change the reset password url in this file.

````javascript
// v1_edit_reset_password_url.js

module.exports = async () => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'users-permissions',
  });

  const values = await pluginStore.get({ key: 'advanced' });
  if (values) {
    values.email_reset_password = strapi.config.custom.FRONT_URL + '/reset-password';
    
    await pluginStore.set({ key: 'advanced', value : values });
  }
};
````

Wait for Strapi to restart or do it manually. I advise turning off Strapi during your code implementation or add watchIgnoreFiles configuration in `./config/admin.js` to cancel auto restart Strapi for each modification of the migrations folder

You should see a migration report in your terminal ⬇️

<img src="https://github.com/TonyDeplanque/strapi-plugin-migrations/raw/main/docs/img/migration_result.png" width="60%"/>

If your restart your Strapi, the file `v1_edit_reset_password_url.js` will not be played again.

## 🤝 Contributing
Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.
