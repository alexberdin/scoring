/**
 PACKAGE LIST

 # Meteor packages used by this project, one per line.
 #
 # 'meteor add' and 'meteor remove' will edit this file for you,
 # but you can also edit it by hand.

 meteor-platform
 iron:router
 sacha:spin
 accounts-password
 ian:bootstrap-3
 ian:accounts-ui-bootstrap-3
 dbarrett:dropzonejs
 aldeed:autoform
 aldeed:collection2
 aldeed:autoform-select2
 natestrauser:select2
 zimme:select2-bootstrap3-css
 ongoworks:security
 meteorhacks:fast-render
 multiply:iron-router-progress
 dburles:collection-helpers
 accounts-base
 alanning:roles
 fortawesome:fontawesome
 yogiben:admin
 fezvrasta:bootstrap-material-design
 aslagle:reactive-table
 anti:i18n
 email
 peerlibrary:server-autorun

 */


var Func = {
    getReqString: function(label,autoform) {
        return {
            label: label || null,
            type: String,
            optional: false,
            autoform: autoform || {}
        }
    },

    getAFSelect: function(options) {
        return {
            type: "select",
            firstOption: ' ',
            options: function () {
                return options;
            }
        }
    },
    getOwner: function() {
        return {
            type: String,
            optional: false,
            regEx: SimpleSchema.RegEx.Id,
            autoValue: function () {
                if (this.isInsert) {
                    return Meteor.userId();
                }
            }
        }
    }
}


///// Localisation ///////////////


    i18n.map('ru', {
        siteName: 'Скоринг Онлайн',
        connectToServer: 'Соединено с сервером',
        notConnectToServer: 'Соединено с сервером отсутствует',
        goScoring: 'Пройти Скоринг',
        createProject: 'Создать проект',
        createIssue: 'Создать вопрос',
        listOfQuestions: 'Список вопросов',
        listOfProjects: 'Список проектов',
        answerTheQuestionsMakingBankLoan:'Ответьте на вопросы для принятия банком решения о выдаче кредита:',
        clickOnLinksYouRequirePassScoring:'Кликните по одной из ссылок для прохождения нужного вам скоринга:',
        toHome:'На главную',
        next:'Дальше',
        form:{
            answersForScoring: 'Вопросы для скоринга:',
            typeOfDisplay: 'Тип отображения:',
            deleteConfirm: 'Вы уверены что хотите удалить?'
        },
        title:'Название',
        control: 'Управление',
        listing:'Листинг',
        autoload:'Автозагрузка',
        question:"Вопрос:",
        selectQuestion: 'Выбрать вопрос:',
        scoringType: 'Тип скоринга:',
        relScoringPage: 'Относительный адрес страницы скоринга:',
        questionStruct: 'Структура вопросов:',
        commentsForPoints: 'Комментарии для диапазона баллов:',
        from: 'От:',
        before: 'До:',
        commentForRange: 'Комментарий для диапазона:',
        commentForAdmin: 'Комментарий для администратора:',
        answers: 'Ответы:',
        textAnswer: 'Текст ответа:',
        point: 'Балл:',
        totalPoints: 'Общий балл:',
        resCount: 'Результат подсчета:',
        name: 'Имя:',
        surname: 'Фамилия:',
        phone: 'Телефон:',
        projectName: 'Проект скоринга:',
        resultComment: 'Комментарий результата:',
        save: 'Сохранить',
        test:'Тест'
    });

    i18n.map('en', {
        siteName: 'Scoring Online',
        connectToServer: 'Connect To Server',
        notConnectToServer: 'The connection to the server is offline',
        goScoring: 'Go scoring',
        createProject: 'Create Project',
        createIssue: 'Create Question',
        listOfQuestions: 'List of Questions',
        listOfProjects: 'List of Projects',
        answerTheQuestionsMakingBankLoan:'Answer the questions for decision-making on the bank loan:',
        clickOnLinksYouRequirePassScoring:'Click on one of the links you require to pass the scoring:',
        toHome:'Home',
        next:'Next',
        form:{
            answersForScoring: 'Answers for scoring:',
            typeOfDisplay: 'Type of Display:',
            deleteConfirm: 'Are you sure you want to delete?'
        },
        title:'Title',
        control: 'Control',
        listing:'Listing',
        autoload:'Autoload',
        question:"Question:",
        selectQuestion: 'Select a question:',
        scoringType: 'Type of scoring:',
        relScoringPage: 'Relative address of the page scoring:',
        questionStruct: 'The structure of the questions:',
        commentsForPoints: 'Comments for range points:',
        from: 'From:',
        before: 'Before:',
        commentForRange: 'Comment for range:',
        commentForAdmin: 'Comments for the administrator:',
        answers:'Answers:',
        textAnswer: 'Text of the answer:',
        point: 'Point:',
        totalPoints: 'Total points:',
        resCount: 'Result Counting:',
        name: 'Name:',
        surname: 'Surname:',
        phone: 'Phone:',
        projectName: 'Project name:',
        resultComment: 'Result comment:',
        save: 'Save',
        test:'Test'
    });

//////////////////////////////////


////// COLLECTIONS  /////////////

ScoringProject = new Meteor.Collection('scoringProject');

ScoringQuestion = new Meteor.Collection('scoringQuestion');

ScoringInstance = new Meteor.Collection('scoringInstance');

ScoringProjectStructureSchema = new SimpleSchema({

    type: Func.getReqString(
        function(){
            return i18n('form.typeOfDisplay');
        },
        Func.getAFSelect([
            {label: i18n('listing'), value: "listing"},
            {label: i18n('autoload'), value: "autoload"}
        ])
    ),


    questions: {
        label: function(){
            return i18n('form.answersForScoring')
        },
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'questions.$.questionId': {
        label: function(){
            return i18n('question');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            placeholder: function(){
                return i18n('selectQuestion');
            },
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    }

});

ScoringProjectSchema = new SimpleSchema({

    title: {
        type: String,
        label: function(){
            return i18n('title')+":";
        },
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                placeholder: function(){
                    return " "+i18n('title');
                }
            }
        }
    },
    type: {
        label: function(){
            return i18n('scoringType');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                return [
                    {label: "Application", value: "application"},
                    {label: "Behavioral", value: "behavioral"}
                ];
            }
        }
    },
    humanFrendlyUrl: {
        type: String,
        label: function(){
            return i18n('relScoringPage');
        },
        max: 200,
        optional: true
    },
    structure: {
        label: function(){
            return i18n('questionStruct');
        },
        type: ScoringProjectStructureSchema,
        optional: false
    },
    rangePointMessage: {
        label: function(){
            return i18n('commentsForPoints');
        },
        type: [Object]
    },
    'rangePointMessage.$.from': {
        label: function(){
            return i18n('from');
        },
        type: Number
    },
    'rangePointMessage.$.to': {
        label: function(){
            return i18n('before');
        },
        type: Number
    },
    'rangePointMessage.$.resultMessage': {
        label: function(){
            return i18n('commentForRange');
        },
        type: String
    },
    owner: Func.getOwner()

});
ScoringProject.attachSchema(ScoringProjectSchema);

ScoringQuestionSchema = new SimpleSchema({

    title: {
        type: String,
        label: function(){
            return i18n('question');
        },
        max: 200,
        optional: false
    },

    adminComment: {
        type: String,
        label: function(){
            return i18n('commentForAdmin');
        },
        max: 200,
        optional: true
    },

    answers: {
        label: function(){
            return i18n('answers');
        },
        type: [Object],
        optional: false,
        minCount: 1,
        maxCount: 5
    },

    'answers.$.text': {
        label: function(){
            return i18n('textAnswer');
        },
        optional: false,
        type: String
    },
    'answers.$.points': {
        type: Number,
        label: function(){
            return i18n('point');
        },
        optional: false,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    owner: Func.getOwner()

});

ScoringQuestion.attachSchema(ScoringQuestionSchema);

ScoringResultSchema = new SimpleSchema({

    results: {
        label: function(){
            return i18n('resCount');
        },
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'results.$.questionId': {
        label: function(){
            return i18n('question');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },

    'results.$.answer': {
        label: function(){
            return i18n('answers');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select-radio",
            options: function () {
//            if (Meteor.isClient) {
//                 var docId = '';

//                 docId = AutoForm.getFormValues("admin_insert");
// console.log(docId);

//             }

                return [
                    {label: "Test", value: "test"},
                    {label: "Test 1", value: "test 1"}
                ];
            }
        }
    }
});


ScoringInstanceSchema = new SimpleSchema({

    title: {
        label: " ",
        type: String,
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                value: "scoringInstance"
            }
        }
    },
    firstname: {
        type: String,
        label: function(){
            return i18n('name');
        },
        max: 200,
        optional: false
    },
    lastname: {
        type: String,
        label: function(){
            return i18n('surname');
        },
        max: 200,
        optional: false
    },
    phone: {
        label: function(){
            return i18n('phone');
        },
        type: String,
        optional: false,
        autoform: {
            afFieldInput: {
                type: "tel"
            }
        }
    },
    email: {
        type: String,
        label: "Email:",
        optional: false,
        autoform: {
            afFieldInput: {
                type: "email"
            }
        }
    },
    projectId: {
        type: String,
        label: function(){
            return i18n('projectName');
        },
        autoform: {
            optional: false,
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringProject', {}, {});
                var scoringProjects = ScoringProject.find({});
                var arrLabels = [];
                scoringProjects.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },
    points: {
        type: Number,
        label: function(){
            return i18n('totalPoints');
        },
        optional: true,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    resultComment: {
        type: String,
        label:  function(){
            return i18n('resultComment');
        },
        optional: true
    },
    /*answers: {
     label: "Результат подсчета:",
     type: ScoringResultSchema,
     },*/
    owner: Func.getOwner()

});

ScoringInstance.attachSchema(ScoringInstanceSchema);

AdminConfig = {
    name: 'Scoring',
    adminEmails: ['leshik-240505@rambler.ru'],
    dashboard: {
//         homeUrl: '/dashboard',
        skin: 'black'
    },
    collections: {
        ScoringProject: {
            icon: 'area-chart',
            color: 'red',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Название', name: 'title'},
                {label: 'Тип', name: 'type'}
            ]
        },
        ScoringQuestion: {
            icon: 'bar-chart',
            color: 'green',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Название', name: 'title'},
                {label: 'Комментарий', name: 'adminComment'}
            ]
        },
        ScoringInstance: {
            icon: 'bank',
            color: 'yellow',
            omitFields: ['owner'],
            tableColumns: [
                {label: 'Имя', name: 'firstname'},
                {label: 'Фамилия', name: 'lastname'}
            ]
        }
    }
};


if (Meteor.isServer) {

    ////// PERMISSIONS ///////////////////////
    Security.permit(['insert', 'update', 'remove']).collections(
        [ScoringProject, ScoringQuestion, ScoringInstance]
    ).apply();


    Meteor.publish("ScoringProject", function (find, options) {
        return ScoringProject.find(find, options);
    });

    Meteor.publish("ScoringQuestion", function (find, options) {
        return ScoringQuestion.find(find, options);
    });

    Meteor.publish("ScoringInstance", function () {
        return ScoringInstance.find();
    });

    Meteor.startup(function () {

//        smtp = {
//            username: '',
//            password: '',
//            server:   'smtp-relay.gmail.com',
//            port: 25
//        }
//
//        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    });

}

if (Meteor.isClient) {


    Router.configure({
        layoutTemplate: 'layout',
        loadingTemplate: 'loading',
        waitOn: function () {
            return [
//                 Meteor.subscribe('NR'),
            ];
        },
        fastRender: true
    });

    Router.map(function () {
        this.route('Main', {
            path: '/',
            fastRender: true
//             disableProgress: true
        });
        this.route('resultMessage', {
            path: '/resultMessage/:project/:points',
//             disableProgress: true
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                var points = this.params.points;
                var project = this.params.project;

                var dataProject = ScoringProject.findOne(project);
                var resultMessage = 'Результат: ';

                if (dataProject.rangePointMessage !== 'undefined') {
                    dataProject.rangePointMessage.forEach(function (obj) {
                        if (points > obj.from && points < obj.to) {
                            resultMessage += obj.resultMessage;
                        }
                    });
                }

                return {
                    'resultMessage': resultMessage,
                    'project': project
                };
            },
            fastRender: true
        });
        this.route('scoringPass', {
            path: '/scoringPass/:humanFrendlyUrl',
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                return ScoringProject.findOne({'humanFrendlyUrl': this.params.humanFrendlyUrl});
            },
            fastRender: true
        });
        this.route('addScoringProject',{
            path: '/addScoringProject',
            fastRender: true
        });
        this.route('addScoringQuestion',{
            path: '/addScoringQuestion',
            fastRender: true
        });
        this.route('scoringQuestionList',{
            path: '/scoringQuestionList',
            fastRender: true
        });
        this.route('scoringProjectList',{
            path: '/scoringProjectList',
            fastRender: true
        });
    });

    Router.onBeforeAction('loading');

    Template.layout.helpers({
        postLayoutView: function() {
            var routeName = Router.current().route.getName();
            if(routeName==='scoringPass') {
                return false;
            }
            return true;
        }
    });

    Template.Main.helpers({
        scoringProjects: function () {
            Meteor.subscribe('ScoringProject', {}, {});
            return ScoringProject.find({});
        }
    });

    Template.scoringPassItem.helpers({
        scoringQuestion: function () {
            Meteor.subscribe('ScoringQuestion', {'_id': this.questionId}, {});
            return ScoringQuestion.findOne(this.questionId);
        }
    });

    Template.scoringQuestionList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            if (event.target.id == "deleteQuestion") {
                if(confirm(i18n('form.deleteConfirm'))){
                    var selfScoringQuestion = this;
                    ScoringQuestion.remove(selfScoringQuestion._id)
                }
            }
        }
    });

    Template.scoringQuestionList.helpers({
        settings: function () {
            return {
                collection:ScoringQuestion,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key:"title",label:i18n('title')},
                    {key: "_id", label:i18n('control'),fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '<span id="deleteQuestion" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.addScoringQuestion.helpers({
        ScoringQuestionCollection: ScoringQuestion
    })

    Template.addScoringProject.helpers({
        ScoringProjectCollection: ScoringProject
    })

    Template.scoringProjectList.helpers({
        settings: function () {
            return {
                collection:ScoringProject,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key:"title",label:i18n('title')},
                    {key: "_id", label:i18n('control'),fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '<span id="deleteProject" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });


    Template.scoringProjectList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            if (event.target.id == "deleteProject") {
                if(confirm(i18n('form.deleteConfirm'))){
                    var selfScoringProject = this;
                    ScoringProject.remove(selfScoringProject._id)
                }
            }
        }
    });

    Template.scoringPass.events({
        'click #scoreResultButton': function (event) {
            var points = 0;
            $('label.active').find('input').map(function () {
                var dataId = $(this).attr('data-id');
                points = points + parseInt(dataId);
            });

            Router.go('resultMessage', {
                'project': this._id,
                'points': points
            });
        }
    });

    Template.scoringPassItem.helpers({
        resultMessage: function () {
//            Meteor.subscribe('ScoringQuestion',{'_id':this.questionId},{});
//            return ScoringQuestion.findOne(this.questionId);
            return points;
        }
    });


    Template.connectionTpl.helpers({
        status: function () {
            return Meteor.status().connected;
        }
    });

    Template.localisation.events({
        'click a': function (event) {
            Session.set('localisation',$(event.target).attr('id'));
        }
    });

    Tracker.autorun(function (c) {
        i18n.setLanguage(Session.get('localisation'));
    });


    AutoForm.hooks({
        insertScoringProject: {
            onSuccess: function (doc) {
                Router.go('scoringProjectList');
                return true;
            }
        },
        insertScoringQuestion: {
            onSuccess: function (doc) {
                Router.go('scoringQuestionList');
                return true;
            }
        }
    });

}///// END CLIENT //////////////////////////


// http://kbs-izdat.com/sovremennoe-sostoyanie-skoringa-v-bankah-ukrainy/







