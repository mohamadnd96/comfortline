import {
  signInWithEmailAndPassword,                         // FireBase plugin
  createUserWithEmailAndPassword,                  
  signOut,                                        
} from "firebase/auth";
import { createStore } from "vuex";
import { auth, db } from "@/firebase";
import {
  ref,
  onValue,
  set,
  get,
  child,
  getDatabase,
  remove,
} from "firebase/database";
import {
  getStorage,
  ref as stref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import router from "@/router";
export default createStore({                                              // initializes and stores the variables of the application
  state: {
    user: null,
    progress: 0,
    hasbuilding: false,
    adminbuildings: null,
    notificationsEntries: {
      buildings: {}, filled: false
    },
    emails: null,
    feedbackresult: null,                                                // FEEDBACK RESULT IS THE DATA FOR THE DASHBOARD 
    notificationsdata: null,
    fetchingfeedbacks: false,
    homefilters: { buildings: { spaces: [], floors: [] }, filled: false },
    backupprocess: { running: false, building: 0, tb: 0, file: 0, tf: 0 },
    editbuilding: null,
    buildingstructure: [],
    ob: null,
    mb: null,
    omb: null,
    uidemails: null,
    loading: false,
    alert: null,
  },
  getters: {},
  mutations: {                                                          // mutations are quick functions, NO COMMUNICATION W/ THE BACK-END (unlike actions)
    load(state) {
      state.loading = true;
    },

    async islogged(state) {
      state.user = null
      if (auth.currentUser) {
        const dbRef = ref(getDatabase());
        let hasbuilding = false;
        await get(child(dbRef, "uidBuildings/" + auth.currentUser.uid)).then(
          async (response) => {
            if (response.val()) {
              hasbuilding = true;
            }
          }
        );
        get(child(dbRef, "uids/" + auth.currentUser.uid)).then(data => {
          state.user = {
            hasbuilding: hasbuilding,
            user: true,
            admin: data.child("isAdmin").val(),
            uid: auth.currentUser.uid,
            email: data.child("email").val(),
          };

          return true;
        }).catch(err => {
          state.user = { user: false }
          router.push({ name: "login" });
          return false;
        })
      } else {
        state.user = { user: false }
        let routeName = router.currentRoute.value.name
        if (routeName != 'contactus' && routeName != 'signup' && routeName != 'login') {
          router.push({ name: "login" });
        }
        return false;
      }
    },

    endload(state) {
      state.loading = false;
    },

    showalert(state, data) {
      state.alert = data;
    },

    setnotificationsEntries(state, data) { state.notificationsEntries = data },

    clearnotificationsEntries(state) {
      state.notificationsEntries = {
        buildings: {}
      }
    },

    closealert(state) {
      state.alert = null;
    },

    cab(state) {
      state.adminbuildings = null;
    },

    clearhomefilters(state) {
      state.homefilters = { buildings: {}, filled: false }
    },

    clearfeedbackresult(state) {
      state.feedbackresult = null
    },

    comb(state) {
      state.omb = null;
    },

    seteditbuilding(state, data) {
      state.editbuilding = data;
    },

    clearuidemails(state) {
      state.uidemails = null;
    },

    clearemails(state) {
      state.emails = null;
    },
  },

  actions: {
    signout() {
      signOut(auth);
      this.state.user = { user: false };
      router.push("login");
    },

    //getters----------------------

    getUidEmails(context) {
      context.commit("load");
      onValue(ref(db, "uidemails/"), (response) => {
        context.state.uidemails = {
          emails: Object.values(response.val()).filter(
            (value) => value != auth.currentUser.email
          ),
          uids: Object.keys(response.val()).filter(
            (value) => value != auth.currentUser.uid
          ),
        };

        context.commit("endload");
      });
    },
    
    deleteBuilding(context, data) {
      context.commit("showalert", {
        text: "Are you sure you want to delete bulding " + data + " permanently with all its floors and spaces?",
        action: () => {
          context.commit("closealert");
          context.commit("load");
          set(ref(db, "adminRequests/deleteBuilding"), data).then(response => {
            context.commit("endload");
            context.commit("showalert", {
              type: "success",
              text: "Building " + data + " has been deleted",
            });
          }).catch(error => {
            context.commit("endload");
            context.commit("showalert", {
              type: "error",
              text: "Error removing building",
            });
          });
        },
      });
    },

    archiveAllData(context) {
      context.commit("showalert", {
        text: "Before starting backup, Please make sure that you have a stable internet connection, Do you want to proceed?",
        action: () => {
          context.commit("closealert");
          const dbRef = ref(getDatabase());                             // we want to read data from the database 
          get(child(dbRef, "allData")).then(async (response) => {
            if (response.val()) {
              context.commit("load");
              const storage = getStorage();
              let error = false;
              try {
                context.state.backupprocess.running = true;                     // process
                context.state.backupprocess.tb = response.size; 
                for (const key in response.val()) {                             // key = building
                  context.state.backupprocess.tf = response.child(key).size;
                  context.state.backupprocess.building += 1;
                  context.state.backupprocess.file = 0;
                  for (const key1 in response.val()[key]) {                     // key1 = file
                    context.state.backupprocess.file += 1;
                    var jsonfile = JSON.stringify(response.val()[key][key1]);
                    var blobfile = new Blob([jsonfile], {
                      type: "application/json",
                    });
                    const testdir = stref(
                      storage,
                      key + "/" + key1 + "/" + key1 + ".json"
                    );
                    await uploadBytes(testdir, blobfile).then((result) => {
                      remove(ref(db, 'allData/' + key + '/' + key1))
                    });
                  }
                }
              } catch (e) {                                 // backup unsuccessful
                context.state.backupprocess = {
                  running: false,
                  building: 0,
                  file: 0,
                  tf: 0,
                  tb: 0,
                };
                error = true;
                context.commit("endload");
                context.commit("showalert", {
                  type: "error",
                  text: "Backup failed",
                });
              }
              if (!error) {                                  // backup sucessful
                context.state.backupprocess = {
                  running: false,
                  building: 0,
                  file: 0,
                  tf: 0,
                  tb: 0,
                };
                context.commit("endload");
                context.commit("showalert", {
                  type: "success",
                  text: "Backup complete",
                });
              }
            } else {                                        // no data to backup 
              // set(ref(db, 'allData/0001'), 'true')
              context.commit("showalert", {
                type: "error",
                text: "No data to backup",
              });
            }
          });
        },
      });
    },

    getAdminBuildings(context) {
      context.commit("load");
      onValue(ref(db, "buildings"), (response) => {
        (context.state.adminbuildings = response.val()),
          context.commit("endload");
      });
    },

    gomb(context) {
      context.commit("load");
      onValue(ref(db, "uidBuildings/" + auth.currentUser.uid), (response) => {
        (context.state.omb = response.val()), context.commit("endload");
      });
    },

    async getHomeData(context, data) {          // BIG FUNCTION -> GET'S THE DATA FOR DASHBOARD FROM BACK END
      context.state.feedbackresult = null;
      let allSpaces = data.space == 0;
      let selectedbuilding = data.building;
      let selectedspace = data.space;
      const dbRef = ref(getDatabase());
      let properties = {
        colors: [
          "#87bd45",
          "#a5cf33",
          "#becf33",
          "#ede05b",
          "#e9c131",
          "#efa61f",
          "#ef9b1f",
          "#f46a9b",
          "#eb5547",
          '#dddddd'
        ],
        labels: {
          "a": [
            "Happy",
            "Neutral",
            "Neutral - I'm neither satisified neither dissatisfied",
            "Neutral - I didn't understand the question",
            "Neutral - I dont't have a clear option",
            "Sad",
            "Sad - The air is stuffy", "Sad - I want more fresh air", "Sad - There are many odors",
            "Not voted"
          ],
          "b": [
            "Happy",
            "Neutral",
            "Neutral - I'm neither satisified neither dissatisfied",
            "Neutral - I didn't understand the question",
            "Neutral - I dont't have a clear option",
            "Sad",
            "Sad - I prefer a warmer space", "Sad - I prefer a colder space", "Sad - Unknown reason",
            "Not voted"
          ],
          "c": [
            "Happy",
            "Neutral",
            "Neutral - I'm neither satisified neither dissatisfied",
            "Neutral - I didn't understand the question",
            "Neutral - I dont't have a clear option",
            "Sad",
            "Sad - The light is too low", "Sad - There is too much light", "Sad - There is not enough natural light",
            "Not voted"
          ],
          "d": [
            "Happy",
            "Neutral",
            "Neutral - I'm neither satisified neither dissatisfied",
            "Neutral - I didn't understand the question",
            "Neutral - I dont't have a clear option",
            "Sad",
            "Sad - There is too much ambient noise", "Sad - I cannot talk in privacy", "Sad - The colleagues speak too loud",
            "Not voted"
          ]
        }
      }
      let line_result = {                       // data for the line graph
        properties: {
          colors: [
            "#58FAF4",
            "#FA5858",
            "#82FA58",
            "#FA58F4",
          ],
          labels: {
            "xAxis": [],
            "yAxis": [
              "Happy",
              "Neutral",
              "Sad"
            ],
            "line": [
              "Air Quality",
              "Thermal Comfort",
              "Visual Comfort",
              "Acoustic Comfort"
            ]
          }
        },
        data: {
          "a": [],
          "b": [],
          "c": [],
          "d": [],
        },
      }
      let resul_t = {                           // data for the pie graphs
        properties: properties,
        data:
        {
          "a": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "b": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "c": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "d": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        totals: {
          "a": 0,
          "b": 0,
          "c": 0,
          "d": 0,
        }
      }
      let resul_t2 = {                          // like result but resets for every date (used for line graph)
        data:
        {
          "a": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "b": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "c": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "d": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      }
      let validdays = 0;
      let voterates = {
        a: [],
        b: [],
        c: [],
        d: [],
        all: [],
        // totalusers: 0,
        totalSpace: 0                                                         // voterates depends on working stations
      }
      let dbpath = "";
      let dbsource = "";
      if (allSpaces) {
        dbsource = "feedbackBuilding/";                                       // when the user selects the building only
        dbpath = selectedbuilding + "/";
      } else {
        dbsource = "feedbackBuildingSpace/";                                  // when the user also selects a space
        dbpath = selectedbuilding + "/" + data.space;
      }
      let dataResult = [];
      let detailsdata = {                                                     // for "More details" tabs
        "a": [{ data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] },],
        "b": [{ data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] },],
        "c": [{ data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] },],
        "d": [{ data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] }, { data: [0] },],
      }
      let rangelabels = []
      context.commit("load");
    if (data.rcase == 1) {                                                    // rcase 1: today's date selected in the date picker
      line_result.properties.labels["xAxis"] = [new Date(data.interval[0])
      .toISOString()
      .split("T")[0]];                                      
      for (const key in detailsdata) {
        for (const index in detailsdata[key]) {
          detailsdata[key][index].data[0] = 0
          detailsdata[key][index].backgroundColor = properties.colors[index]
          detailsdata[key][index].label = properties.labels[key][index]
        }
      }
      if(allSpaces) {
        await get(
          child(dbRef, "buildings/" + selectedbuilding + "/spacesID")
          ).then((spaces) => {
          if(spaces.val()) {
            for(var space in spaces.val()) {
              get(
                child(dbRef, "buildings/" + selectedbuilding + "/spacesID/" + space + "/workingStations")
              ).then((nbStations) => {
                voterates.totalSpace += Number(nbStations.val());
              })
            }
          }
        }
        )
      } else {
        await get(
          child(dbRef, "spacesID/" + selectedspace + "/workingStations")
          ).then((nbStations) => {
            voterates.totalSpace += Number(nbStations.val());
          })
      }
      // await get(
      //   child(
      //     dbRef,
      //     allSpaces
      //       ? "buildings/" + selectedbuilding + "/users"
      //       : "spacesID/" + selectedspace + "/users"
      //   )
      // ).then((users) => {
      //   if (users.val()) {
      //     voterates.totalusers = Object.keys(users.val()).length;
      //   }
      // });
      await get(child(dbRef, dbsource + dbpath)).then(async (response) => {
        if (response.val()) {                                                     // Object.keys(response.val()) = list of all user voting
          let totalvotes = Object.keys(response.val()).length
          for (const key in response.val()) {                                     // iterate on users
            let user = response.val()[key];
            if (!voterates.all.includes(key)) {                                   // add user to all the user who voted (if not already)
              voterates.all.push(key)
            }
            for (const key2 in response.val()[key].feedback) {                    // iterate on all answers
              let question = key2;
              if (!voterates[question].includes(key)) {
                voterates[question].push(key)
              }
              detailsdata[question][9]['data'][0] = voterates.totalSpace > totalvotes ? (voterates.totalSpace - totalvotes) : 0
              resul_t.data[question][9] = voterates.totalSpace > totalvotes ? (voterates.totalSpace - totalvotes) : 0
              if (user.feedback[question].a == 1) {                                               // HAPPY
                detailsdata[question][0]['data'][0] += 1
                resul_t.data[question][0] += 1

              } else if (user.feedback[question].a == 2) {                                        // NEUTRAL
                if (user.feedback[question].s == 0) {
                  detailsdata[question][1]['data'][0] += 1
                  resul_t.data[question][1] += 1

                }
                if (user.feedback[question].s == 1) {
                  detailsdata[question][2]['data'][0] += 1
                  resul_t.data[question][2] += 1
                }
                if (user.feedback[question].s == 2) {
                  detailsdata[question][3]['data'][0] += 1
                  resul_t.data[question][3] += 1
                }
                if (user.feedback[question].s == 3) {
                  detailsdata[question][4]['data'][0] += 1
                  resul_t.data[question][4] += 1
                }
              } else if (user.feedback[question].a == 3) {                                        // SAD
                if (user.feedback[question].s == 0) {
                  detailsdata[question][5]['data'][0] += 1
                  resul_t.data[question][5] += 1
                }
                if (user.feedback[question].s == 1) {
                  detailsdata[question][6]['data'][0] += 1
                  resul_t.data[question][6] += 1
                }
                if (user.feedback[question].s == 2) {
                  detailsdata[question][7]['data'][0] += 1
                  resul_t.data[question][7] += 1
                }
                if (user.feedback[question].s == 3) {
                  detailsdata[question][8]['data'][0] += 1
                  resul_t.data[question][8] += 1
                }
              }
            }
          }
        }
      });
      let questions = ["a", "b", "c", "d"]
      for (let index = 0; index < questions.length; index++) {
        let result = resul_t.data[questions[index]]
        let happy = result[0]
        let neutral = result[1] + result[2] + result[3] + result[4]
        let sad = result[5] + result[6] + result[7] + result[8]
        if (happy >= neutral && happy >= sad) {
          line_result.data[questions[index]].push(2)
        } else if (neutral >= happy && neutral >= sad) {
          line_result.data[questions[index]].push(1)
        } else {
          line_result.data[questions[index]].push(0)
        }
      }
      context.state.feedbackresult = {
        linedata: line_result,
        data1: resul_t,
        details: detailsdata,
        labels: [new Date(data.interval[0])
          .toISOString()
          .split("T")[0]],
        voterates: {
          a: {
            data: [voterates.a.length, voterates.totalSpace>voterates.a.length ? voterates.totalSpace - voterates.a.length : 0],
            percentage: voterates.totalSpace>voterates.a.length ? (voterates.a.length / voterates.totalSpace) * 100 : 100
          },
          b: {
            data: [voterates.a.length, voterates.totalSpace>voterates.b.length ? voterates.totalSpace - voterates.b.length : 0],
            percentage: voterates.totalSpace>voterates.b.length ? (voterates.b.length / voterates.totalSpace) * 100 : 100
          },
          c: {
            data: [voterates.a.length, voterates.totalSpace>voterates.c.length ? voterates.totalSpace - voterates.c.length : 0],
            percentage: voterates.totalSpace>voterates.c.length ? (voterates.c.length / voterates.totalSpace) * 100 : 100
          },
          d: {
            data: [voterates.a.length, voterates.totalSpace>voterates.d.length ? voterates.totalSpace - voterates.d.length : 0],
            percentage: voterates.totalSpace>voterates.d.length ? (voterates.d.length / voterates.totalSpace) * 100 : 100
          },
          all: {
            data: [voterates.all.length, voterates.totalSpace>voterates.all.length ? voterates.totalSpace - voterates.all.length : 0],
            percentage: voterates.totalSpace>voterates.all.length ? (voterates.all.length / voterates.totalSpace) * 100 : 100
          },
          total: voterates.totalSpace,
          properties: {
            colors: ["#375A64", "#dddddd"],
            labels: ["Voted", "Not voted"],
          }
        },
      };
      context.commit("endload");
      return true;
    } else {                                                                  // rcase 2: range of dates with today, rcase 3: range of dates without today
        let todaydata = data.rcase == 2;
        line_result.properties.labels["xAxis"] = data.interval;
        const storage = getStorage();
        if(allSpaces) {
          await get(
            child(dbRef, "buildings/" + selectedbuilding + "/spacesID")
          ).then((spaces) => {
            if(spaces.val()) {
              for(var space in spaces.val()) {
                get(
                  child(dbRef, "buildings/" + selectedbuilding + "/spacesID/" + space + "/workingStations")
                ).then((nbStations) => {
                  voterates.totalSpace += Number(nbStations.val());
                })
              }
            }
          }
          )
        } else {
          await get(
            child(
              dbRef, "spacesID/" + selectedspace + "/workingStations")
              ).then((nbStations) => {
                voterates.totalSpace += Number(nbStations.val());
            })
        }
        // await get(
        //   child(
        //     dbRef,
        //     allSpaces
        //       ? "buildings/" + selectedbuilding + "/users"
        //       : "spacesID/" + selectedspace + "/users"
        //   )
        // ).then((users) => {
        //   if (users.val()) {
        //     voterates.totalusers = Object.keys(users.val()).length;
        //   }
        // });
        for (const index in data.interval) {          // one loop for each date included in the rage
          dataResult = [];
          resul_t2 = {
            data:
            {
              "a": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              "b": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              "c": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              "d": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
          }
          let dateindex = index
          for (const key in detailsdata) {
            for (const index in detailsdata[key]) {
              detailsdata[key][index].data[dateindex] = 0
              detailsdata[key][index].backgroundColor = properties.colors[index]
              detailsdata[key][index].label = properties.labels[key][index]
            }
          }
          let day = data.interval[index];
          data.interval[index] = new Date(data.interval[index])
            .toISOString()
            .split("T")[0];
          let fullpath =
            "allData/" +
            selectedbuilding +
            "/" +
            day +
            "/" +
            dbsource +
            dbpath.replace(selectedbuilding + "/", "");
          if (dateindex == data.interval.length - 1 && todaydata == true) {
            await get(child(dbRef, dbsource + dbpath)).then(async (response) => {
              if (response.val()) {
                dataResult = Object.values(response.val());
                validdays += 1
              }
            })
          } else {
            await get(child(dbRef, fullpath))
              .then(async (response) => {
                if (response.val()) {
                  dataResult = Object.values(response.val());
                  validdays += 1
                } else {
                  const pathReference = stref(
                    storage,
                    selectedbuilding + "/" + day
                  );
                  await listAll(pathReference)
                    .then(async (path) => {
                      if (path.items.length != 0) {
                        validdays += 1
                        await getDownloadURL(
                          stref(storage, path.items[0].fullPath)
                        ).then(async (url) => {
                          await fetch(url)
                            .then((response) => response.json())
                            .then((data) => {
                              if (allSpaces) {
                                dataResult = Object.values(
                                  data[dbsource.replace("/", "")]
                                );
                              } else {
                                if (
                                  data[dbsource.replace("/", "")][
                                  selectedspace
                                  ] != null
                                ) {
                                  dataResult = Object.values(
                                    data[dbsource.replace("/", "")][selectedspace]
                                  );
                                }
                              }
                            });
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (dataResult.length != 0) {
            for (const key in dataResult) {
              if (!voterates.all.includes(key)) {
                voterates.all.push(key)
              }
              let user = dataResult[key];
              for (const key2 in dataResult[key].feedback) {
                let question = key2;
                detailsdata[question][9]['data'][dateindex] = voterates.totalSpace>dataResult.length ? (voterates.totalSpace - dataResult.length) : 0
                if (!voterates[question].includes(key)) {
                  voterates[question].push(key)
                }
                if (user.feedback[question].a == 1) {
                  detailsdata[question][0]['data'][dateindex] += 1
                  resul_t.data[question][0] += 1
                  resul_t2.data[question][0] += 1
                } else if (user.feedback[question].a == 2) {
                  if (user.feedback[question].s == 0) {
                    detailsdata[question][1]['data'][dateindex] += 1
                    resul_t.data[question][1] += 1
                    resul_t2.data[question][1] += 1
                  }
                  if (user.feedback[question].s == 1) {
                    detailsdata[question][2]['data'][dateindex] += 1
                    resul_t.data[question][2] += 1
                    resul_t2.data[question][2] += 1
                  }
                  if (user.feedback[question].s == 2) {
                    detailsdata[question][3]['data'][dateindex] += 1
                    resul_t.data[question][3] += 1
                    resul_t2.data[question][3] += 1
                  }
                  if (user.feedback[question].s == 3) {
                    detailsdata[question][4]['data'][dateindex] += 1
                    resul_t.data[question][4] += 1
                    resul_t2.data[question][4] += 1
                  }
                } else if (user.feedback[question].a == 3) {
                  if (user.feedback[question].s == 0) {
                    detailsdata[question][5]['data'][dateindex] += 1
                    resul_t.data[question][5] += 1
                    resul_t2.data[question][5] += 1
                  }
                  if (user.feedback[question].s == 1) {
                    detailsdata[question][6]['data'][dateindex] += 1
                    resul_t.data[question][6] += 1
                    resul_t2.data[question][6] += 1
                  }
                  if (user.feedback[question].s == 2) {
                    detailsdata[question][7]['data'][dateindex] += 1
                    resul_t.data[question][7] += 1
                    resul_t2.data[question][7] += 1
                  }
                  if (user.feedback[question].s == 3) {
                    detailsdata[question][8]['data'][dateindex] += 1
                    resul_t.data[question][8] += 1
                    resul_t2.data[question][8] += 1
                  }
                }
              }
            }
          }
          let questions = ["a", "b", "c", "d"]
          for (let index = 0; index < questions.length; index++) {
            let result = resul_t2.data[questions[index]]
            let happy = result[0]
            let neutral = result[1] + result[2] + result[3] + result[4]
            let sad = result[5] + result[6] + result[7] + result[8]
            if (happy >= neutral && happy >= sad) {
              line_result.data[questions[index]].push(2)
            } else if (neutral >= happy && neutral >= sad) {
              line_result.data[questions[index]].push(1)
            } else {
              line_result.data[questions[index]].push(0)
            }
          }
        }
        // voterates.totalusers = voterates.totalusers * validdays
        voterates.totalSpace = voterates.totalSpace * data.interval.length
        for (const q in resul_t.data) {
          resul_t.data[q][9] = voterates.totalSpace > voterates.all.length ? (voterates.totalSpace - voterates.all.length) : 0
        }
        if (data.interval.length > 5) {
          for (const q in detailsdata) {
            for (const f in detailsdata[q]) {
              detailsdata[q][f].data = detailsdata[q][f].data.slice(-5);
            }
          }
          rangelabels = data.interval.slice(-5)
        } else {
          rangelabels = data.interval
        }
        context.state.feedbackresult = {
          linedata: line_result,
          data1: resul_t,                                           // result of main page execept vote rates
          details: detailsdata,                                     // result of detailed data
          labels: rangelabels,                                      // all labels
          voterates: {                                              // different vote rate graphs
            a: {
              data: [voterates.a.length, voterates.totalSpace>voterates.a.length ? voterates.totalSpace - voterates.a.length : 0],
              percentage: voterates.totalSpace>voterates.a.length ? (voterates.a.length / voterates.totalSpace) * 100 : 100
            },
            b: {
              data: [voterates.a.length, voterates.totalSpace>voterates.b.length ? voterates.totalSpace - voterates.b.length : 0],
              percentage: voterates.totalSpace>voterates.b.length ? (voterates.b.length / voterates.totalSpace) * 100 : 100
            },
            c: {
              data: [voterates.a.length, voterates.totalSpace>voterates.c.length ? voterates.totalSpace - voterates.c.length : 0],
              percentage: voterates.totalSpace>voterates.c.length ? (voterates.c.length / voterates.totalSpace) * 100 : 100
            },
            d: {
              data: [voterates.a.length, voterates.totalSpace>voterates.d.length ? voterates.totalSpace - voterates.d.length : 0],
              percentage: voterates.totalSpace>voterates.d.length ? (voterates.d.length / voterates.totalSpace) * 100 : 100
            },
            all: {
              data: [voterates.all.length, voterates.totalSpace>voterates.all.length ? voterates.totalSpace - voterates.all.length : 0],
              percentage: voterates.totalSpace>voterates.all.length ? (voterates.all.length / voterates.totalSpace) * 100 : 100
            },
            total: voterates.totalSpace,
            properties: {
              colors: ["#375A64", "#dddddd"],
              labels: ["Voted", "Not voted"],
            }
          },
        }
        context.commit("endload");
        return true;
     }
    },

    async getnotificationsData(context, data) {
      context.state.notificationsdata = null;
      let voterates = {
        voted: 0,
        // totalusers: 0,
        totalSpace: 0
      }
      let properties = {
        colors: [
          "#87bd45", "#eb5547",
          "#e9c131",
        ],
        labels: [
          "Coming tomorrow",
          "Not coming",
          "Maybe",
        ]
      }
      let resul_t = {
        properties: properties,
        data: [0, 0, 0],
      }
      let allSpaces = data.space == 0;
      let selectedbuilding = data.building;
      let selectedspace = data.space;
      const dbRef = ref(getDatabase());
      let dbpath = "";
      let dbsource = "";
      if (allSpaces) {
        dbsource = "inOfficeTomorrowBuilding/";
        dbpath = selectedbuilding + "/";
      } else {
        dbsource = "inOfficeTomorrowBuildingSpace/";
        dbpath = selectedbuilding + "/" + data.space;
      }
      await get(child(dbRef, dbsource + dbpath)).then(async (response) => {
        for (const key in response.val()) {
          voterates.voted += 1
          let user = response.val()[key];
          if (user.iot == 'y') {
            resul_t.data[0] += 1
          } else if (user.iot == 'n') {
            resul_t.data[1] += 1
          } else {
            resul_t.data[2] += 1
          }
        }
      });
      if(allSpaces) {
        await get(
          child(dbRef, "buildings/" + selectedbuilding + "/spacesID")
        ).then((spaces) => {
          if(spaces.val()) {
            for(var space in spaces.val()) {
              get(
                child(dbRef, "buildings/" + selectedbuilding + "/spacesID/" + space + "/workingStations")
              ).then((nbStations) => {
                voterates.totalSpace += nbStations;
              })
            }
          }
        }
        )
      } else {
        await get(
          child(
            dbRef, "spacesID/" + selectedspace + "/workingStations")
            ).then((nbStations) => {
              voterates.totalSpace += nbStations;
          })
      }
      // await get(
      //   child(
      //     dbRef,
      //     allSpaces
      //       ? "buildings/" + selectedbuilding + "/users"
      //       : "spacesID/" + selectedspace + "/users"
      //   )
      // ).then((users) => {
      //   voterates.totalusers = Object.keys(users.val()).length;
      // });
      context.state.notificationsdata = {
        answers: resul_t,
        voterates: {
          voted: voterates.voted,
          notvoted: voterates.totalSpace > voterates.voted ? (voterates.totalSpace - voterates.voted) : 0,
          total: voterates.totalSpace,
          properties: {
            colors: ["#375A64", "#dddddd"],
            labels: ["Answered", "Not answered"],
          }
        },
      };
      context.commit("endload");
      return true;
    },

    async getHomeFilters(context) {
      context.commit("load");
      const dbRef = ref(getDatabase());
      let datasource = "";
      let result1 = {}                       
      if (context.state.user.admin == 1) {                                           // IF ADMIN
        await get(child(dbRef, "buildings")).then(                                   // search buildings in database
          async (response) => {                                                      // response = building array
            for (const key in response.val()) {                                      // key = building
              if (key != 'block' && response.child(key).hasChild('spacesID')) {      // admin can have blocks while the owner can't (block = useless building)
                result1[key] = {
                  floors: [
                    { name: 'All floors', nr: "0" }
                  ],
                  spaces: [{ name: 'All spaces', nr: "0" }],
                  data: { name: response.val()[key].companyName, nr: key }
                }
                const includedFloors = []
                Object.keys(response.val()[key].spacesID).forEach((key1) => {
                  const floor = key1.substring(0, 6)
                  const floorName = response.val()[key]['spacesID'][key1].floorName
                  const spaceName = response.val()[key]['spacesID'][key1].spaceName
                  if (includedFloors.includes(floor)) {
                    result1[key].spaces.push({ name: spaceName, nr: key1 })
                  } else {
                    result1[key].floors.push({ name: (typeof floorName != "undefined" && floorName != null) ? floorName : floor, nr: floor })
                    result1[key].spaces.push({ name: spaceName, nr: key1 })
                    includedFloors.push(floor)
                  }
                });
              }
            }
            context.state.homefilters.buildings = result1;
            context.state.homefilters.filled = true;
          }
        );
      } else {                                                                        // IF OWNER
        await get(child(dbRef, "uidBuildings/" + auth.currentUser.uid)).then(
          async (response) => {                                                       // reponse = array of onwer's buildings
            let result1 = {}
            Object.values(response.val()).forEach((child) => {
              for (const key in child) {
                result1[key] = {
                  floors: [
                    { name: 'All floors', nr: "0" }
                  ],
                  spaces: [{ name: 'All spaces', nr: "0" }],
                  data: { name: child[key].companyName, nr: key }
                }
                if (child[key].spacesID) {
                  const includedFloors = []
                  Object.keys(child[key].spacesID).forEach((key1) => {
                    const floor = key1.substring(0, 6)
                    const floorName = child[key]['spacesID'][key1].floorName
                    const spaceName = child[key]['spacesID'][key1].spaceName
                    if (includedFloors.includes(floor)) {
                      result1[key].spaces.push({ name: spaceName, nr: key1 })
                    } else {
                      result1[key].floors.push({ name: (typeof floorName != "undefined" && floorName != null) ? floorName : floor, nr: floor })
                      result1[key].spaces.push({ name: spaceName, nr: key1 })
                      includedFloors.push(floor)
                    }
                  });
                }
              }
            });
            context.state.homefilters.buildings = result1;
            context.state.homefilters.filled = true;
          }
        );
      }
      context.commit("endload");
    },

    async getnotificationsEntries(context) {
      // let entries = context.state.notificationsEntries.buildings
      context.commit("load");
      const dbRef = ref(getDatabase());
      let result = {
      }
      await get(child(dbRef, "uidBuildings/" + auth.currentUser.uid)).then(
        async (response) => {
          Object.values(response.val()).forEach((child) => {
            for (const key in child) {
              if (child[key].spacesID) {
                result[key] = {
                  floors: [],
                  spaces: []
                }
                // entries[key] = [];

                Object.keys(child[key].spacesID).forEach((key1) => {
                  let floor = key1.substring(0, 6)
                  if (result[key].floors.includes(floor)) {
                    result[key].spaces.push(key1)
                  } else {
                    result[key].floors.push(floor)
                    result[key].spaces.push(key1)
                  }
                });
              }
            }
          });
        }
      );
      context.state.notificationsEntries.buildings = result
      context.state.notificationsEntries.filled = true;
      context.commit("endload");
      return true
    },

    //setters--------------------

    addbuilding(context, data) {
      context.commit("load");
      set(ref(db, "/adminRequests/createBuilding/"), data).then((value) => {

        context.commit("endload");
        context.commit("showalert", {
          type: "success",
          title: "Building added",
          text: "You have successfully added the building",
        });
        router.back();
      });
    },

    editbuilding(context, data) {
      context.commit("load");
      set(
        ref(db, "/ownersRequests/" + auth.currentUser.uid + "/updateBuilding"),
        data
      ).then((value) => {

        context.commit("endload");
        context.commit("showalert", {
          type: "success",
          title: "Saved",
          text: "You have successfully edited the building",
        });
        router.back();
      });
    },

    addmanager(context, data) {
      context.commit("load");
      set(
        ref(db, "/ownersRequests/" + auth.currentUser.uid + "/addManager"),
        data
      ).then((value) => {

        context.commit("endload");
        context.commit("showalert", {
          type: "success",
          title: "Success",
          text: "Manager added successfully",
        });
        router.back();
      });
    },

    async notify(context, data) {
      if (data.body != "") {
        let error = false
        context.commit('load')
        for (const index in data.targets) {
          let target = data.targets[index]
          await set(
            ref(db, "/ownersRequests/" + auth.currentUser.uid + "/pushNotification/" + target),
            {
              title: data.title,
              body: data.body
            }
          ).catch(err => {
            error = true
            return;
          })
        }
        context.commit('endload')
        if (error) {
          context.commit("showalert", {
            type: "error",
            title: "Error",
            text: "Something went wrong, try again",
          });
        } else {
          context.commit("showalert", {
            type: "success",
            title: "Success",
            text: "Notification sent",
          });
        }
      } else {
        context.commit("showalert", {
          type: "error",
          title: "Error",
          text: "Please fix all errors",
        });
      }
    },

    signup(context, data) {
      if (data.pass == data.repass) {
        context.commit("load");
        createUserWithEmailAndPassword(auth, data.email, data.pass)
          .then((value) => {
            signOut(auth);
            context.commit("showalert", {
              type: "success",
              text: "Account created successfully, please sign in",
              action: () => {
                context.commit("closealert");
                router.push({ name: "login" });
              },
            });
            // this.state.user = value.user
            context.commit("endload");
          })
          .catch((error) => {
            context.commit("showalert", {
              type: "error",
              text: error.toString(),
            });
            context.commit("endload");
          });
      } else {
        context.commit("showalert", {
          type: "error",
          text: "The entered passwords did not match",
        });
      }
    },

    maptest(context, data) {
      alert(data)
    },

    async signin(context, data) {
      context.commit("load");                                         // call mutation load (L.52)
      signInWithEmailAndPassword(auth, data.email, data.pass)
        .then(async (value) => {                                      // TRY
          const dbRef = ref(getDatabase());                           // read data from the database with dbRef
          let hasbuilding = false;                                    // does the user have a building
          await get(child(dbRef, "uidBuildings/" + auth.currentUser.uid)).then(     // get data from the data base -> does the user have a building
            async (response) => {
              if (response.val()) {
                hasbuilding = true;                                                 // user has a building
              }
            })
          get(child(dbRef, "uids/" + value.user.uid)).then(data => {                // get the user data from the back end
            context.state.user = {                                                  // context == this
              hasbuilding: hasbuilding,
              user: true,
              admin: data.child("isAdmin").val(),
              uid: value.user.uid,
              email: data.child("email").val(),
            };
            router.push({ name: "home" });
            context.commit("endload");
          });

        })
        .catch((error) => {                                           // CATCH
          context.commit("showalert", {
            type: "error",
            text: error.toString(),
          });
          context.commit("endload");
        });
    },
  },
  modules: {},
});
