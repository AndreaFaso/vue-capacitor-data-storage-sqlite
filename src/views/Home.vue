<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Vue Capacitor
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      The world is your oyster.
      <p>
        If you get lost, the
        <a href="https://ionicframework.com/docs">docs</a> will be your guide.
      </p>
      <ion-button @click="goToAbout" full>Go to About</ion-button>
      <ion-button @click="showDialogAlert" full>Show Alert Box</ion-button>
      <ion-button @click="showToast" full>Show Toast</ion-button>
      <ion-button @click="testSqlite" full>Test Plugin SQL</ion-button>
      <ion-button @click="setTables" full>Set Tables</ion-button>
      <ion-button @click="getTable('saveData')" full>Get Table1</ion-button>
      <ion-button @click="getTable('users')" full>Get Table2</ion-button>
      <ion-button @click="getTable('myStore')" full>Get Table3</ion-button>

      <p class="platform hidden"></p>

      <p class="populate hidden">
        Storing data successful
      </p>
      <p class="iskey hidden">
        Iskey successful
      </p>
      <p class="keys hidden">
        Get keys successful
      </p>
      <p class="values hidden">
        Get values successful
      </p>
      <p class="keysvalues hidden">
        Get keys/values successful
      </p>
      <p class="remove hidden">
        Remove key successful
      </p>
      <p class="clear hidden">
        Clear keys successful
      </p>
      <p class="success hidden">
        The test was successful
      </p>
      <p class="failure hidden">
        The test failed
      </p>
    </ion-content>
  </ion-app>
</template>

<style>
.hidden {
  visibility: hidden;
}
</style>

<script>
import { Plugins } from "@capacitor/core";
import * as CapacitorSQLWebPlugin from "capacitor-data-storage-sqlite";

const { Toast, Modals, Device, CapacitorDataStorageSqlite } = Plugins;
const DB_NAME = "test_tables";

async function getStorage() {
  const info = await Device.getInfo();
  let storage = {};
  if (info.platform === "ios" || info.platform === "android") {
    storage = CapacitorDataStorageSqlite;
  } else {
    storage = CapacitorSQLWebPlugin.CapacitorDataStorageSqlite;
  }
  return storage;
}
async function database(table) {
  const storage = await getStorage();
  const { result: db } = await storage.openStore({
    database: DB_NAME
  });

  if (!db)
    return Promise.reject(`Couldn't open the store with database "${DB_NAME}"`);

  const { result, message } = await storage.setTable({ table });

  return result ? Promise.resolve(storage) : Promise.reject(message);
}
export default {
  name: "Home",
  methods: {
    goToAbout() {
      this.$router.push("about");
    },
    async showDialogAlert() {
      await Modals.alert({
        title: "Alert",
        message: "This is an alert message."
      });
    },
    async showToast() {
      await Toast.show({
        text: "Hello from Capacitor!",
        duration: 150
      });
    },
    async setTables() {
      var storage = await database("saveData");
      // eslint-disable-next-line no-unused-vars
      var result = await storage.set({
        key: "message1",
        value: "Welcome from Jeep"
      });
      result = await storage.set({ key: "message2", value: "Hello World!" });
      storage = await database("users");
      result = await storage.set({
        key: "user1",
        value: JSON.stringify({
          age: 50,
          name: "jeep",
          email: "jeep@example.com"
        })
      });
      result = await storage.set({
        key: "user2",
        value: JSON.stringify({
          age: 35,
          name: "jones",
          email: "jones@example.com"
        })
      });
      storage = await database("myStore");
      result = await storage.set({ key: "a", value: "251.35" });
      result = await storage.set({ key: "session", value: "expired" });
    },
    async getTable(table) {
      const storage = await database(table);
      const { keysvalues } = await storage.keysvalues();
      console.log(`***  table: ${table} ***`);
      console.log(keysvalues);
    },
    async testSqlite() {
      const info = await Device.getInfo();
      const pltEl = document.querySelector(".platform");
      pltEl.textContent = info.platform;
      pltEl.classList.remove("hidden");
      const storage = await getStorage();

      //populate some data
      //string
      let retpopulate = false;
      let retiskey = false;
      let retkeys = false;
      let retvalues = false;
      let retkeysvalues = false;
      let retremove = false;
      let retclear = false;
      let resOpen = await storage.openStore({});
      console.log("resOpen  ", resOpen);
      if (resOpen) {
        let result = await storage.set({
          key: "session",
          value: "Session Opened"
        });
        console.log("Save Data : " + result.result);
        result = await storage.get({ key: "session" });
        let ret1 = false;
        console.log("Get Data : " + result.value);
        if (result.value === "Session Opened") ret1 = true;
        result = await storage.get({ key: "session1" });
        let ret1a = false;
        if (result.value === null) ret1a = true;
        // json
        let data = { a: 20, b: "Hello World", c: { c1: 40, c2: "cool" } };
        await storage.set({ key: "testJson", value: JSON.stringify(data) });
        result = await storage.get({ key: "testJson" });
        let ret2 = false;
        if (result.value === JSON.stringify(data)) ret2 = true;
        // number
        let data1 = 243.567;
        await storage.set({ key: "testNumber", value: data1.toString() });
        result = await storage.get({ key: "testNumber" });
        let ret3 = false;
        if (result.value === data1.toString()) ret3 = true;
        if (ret1 && ret1a && ret2 && ret3) retpopulate = true;
        if (retpopulate)
          document.querySelector(".populate").classList.remove("hidden");

        result = await storage.iskey({ key: "testNumber" });
        ret1 = result.result;
        result = await storage.iskey({ key: "foo" });
        ret2 = result.result;
        if (ret1 && !ret2) retiskey = true;
        if (retiskey)
          document.querySelector(".iskey").classList.remove("hidden");

        result = await storage.keys();
        if (
          result.keys.length === 3 &&
          result.keys[0] === "session" &&
          result.keys[1] === "testJson" &&
          result.keys[2] === "testNumber"
        ) {
          retkeys = true;
          document.querySelector(".keys").classList.remove("hidden");
        }
        result = await storage.values();
        if (
          result.values.length === 3 &&
          result.values[0] === "Session Opened" &&
          result.values[1] === JSON.stringify(data) &&
          result.values[2] === data1.toString()
        ) {
          retvalues = true;
          document.querySelector(".values").classList.remove("hidden");
        }

        storage.keysvalues().then(result => {
          if (
            result.keysvalues.length === 3 &&
            result.keysvalues[0].key === "session" &&
            result.keysvalues[0].value === "Session Opened" &&
            result.keysvalues[1].key === "testJson" &&
            result.keysvalues[1].value === JSON.stringify(data) &&
            result.keysvalues[2].key === "testNumber" &&
            result.keysvalues[2].value === data1.toString()
          ) {
            retkeysvalues = true;
            document.querySelector(".keysvalues").classList.remove("hidden");
            storage.remove({ key: "testJson" }).then(result => {
              if (result.result) {
                storage.keysvalues().then(async res => {
                  if (
                    res.keysvalues.length === 2 &&
                    res.keysvalues[0].key === "session" &&
                    res.keysvalues[0].value === "Session Opened" &&
                    res.keysvalues[1].key === "testNumber" &&
                    res.keysvalues[1].value === data1.toString()
                  ) {
                    retremove = true;
                    document
                      .querySelector(".remove")
                      .classList.remove("hidden");
                  }
                  result = await storage.clear();
                  if (result.result) {
                    let res = await storage.keysvalues();
                    if (res.keysvalues.length === 0) {
                      retclear = true;
                      document
                        .querySelector(".clear")
                        .classList.remove("hidden");
                    }
                    if (
                      retpopulate &&
                      retiskey &&
                      retkeys &&
                      retvalues &&
                      retkeysvalues &&
                      retremove &&
                      retclear
                    ) {
                      document
                        .querySelector(".success")
                        .classList.remove("hidden");
                    } else {
                      document
                        .querySelector(".failure")
                        .classList.remove("hidden");
                    }
                  } else {
                    document
                      .querySelector(".failure")
                      .classList.remove("hidden");
                  }
                });
              } else {
                document.querySelector(".failure").classList.remove("hidden");
              }
            });
          } else {
            document.querySelector(".failure").classList.remove("hidden");
          }
        });
      } else {
        document.querySelector(".failure").classList.remove("hidden");
      }
    }
  }
};
</script>
