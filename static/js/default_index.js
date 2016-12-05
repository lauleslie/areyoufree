// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    }

    function get_posts_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_posts + "?" + $.param(pp);
    }

    self.get_posts = function (x) {
        $.getJSON(get_posts_url(0, x), function (data) {
            self.vue.posts = data.posts;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.user = data.user;
            enumerate(self.vue.posts);
        })
    };

    self.get_more = function () {
        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
            enumerate(self.vue.posts);
        });
    };

    self.add_post_button = function () {
        // The button to add a post has been pressed.
        self.vue.is_adding_post = !self.vue.is_adding_post;
    };

    self.add_post = function () {
        // The submit button to add a post has been added.
        $.post(add_post_url,
            {
                post_content: self.vue.form_post_content,
                event_description: self.vue.form_event_description,
                event_location: self.vue.form_event_location,
                start_date: self.vue.form_start_date,
                end_date: self.vue.form_end_date,
                start_time: self.vue.form_start_time,
                end_time: self.vue.form_end_time,
                invite_list: self.vue.form_invite_list,
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                enumerate(self.vue.posts);
                self.get_posts(4);
            });
        self.add_post_button();
        self.vue.form_post_content = "";
        self.vue.form_event_description = "";
        self.vue.form_event_location = "";
        self.vue.form_start_date = "";
        self.vue.form_end_date = "";
        self.vue.form_start_time = "";
        self.vue.form_end_time = "";
        self.vue.form_invite_list = "";

    };

    self.delete_post = function(post_idx) {
        $.post(del_post_url,
            { post_id: self.vue.posts[post_idx].id },
            function () {
                self.vue.posts.splice(post_idx, 1);
                enumerate(self.vue.posts);
            });
        if (self.vue.posts.length < 4){
            self.get_posts(4);
        }
    };

    self.edit_post_button = function(post_idx) {
        self.vue.is_editing_post = !self.vue.is_editing_post;
        self.vue.edit_post_id = self.vue.posts[post_idx].id;
        self.vue.form_edit_content = self.vue.posts[post_idx].post_content;
        self.vue.form_edit_event_description = self.vue.posts[post_idx].event_description;
        self.vue.form_edit_event_location = self.vue.posts[post_idx].event_location;
        self.vue.form_edit_start_date = self.vue.posts[post_idx].start_date;
        self.vue.form_edit_end_date = self.vue.posts[post_idx].end_date;
        self.vue.form_edit_start_time = self.vue.posts[post_idx].start_time;
        self.vue.form_edit_end_time = self.vue.posts[post_idx].end_time;
        self.vue.form_edit_invite_list = self.vue.posts[post_idx].invite_list;
    };

    self.edit_post = function(post_idx) {
        $.post(edit_post_url,
            {
                post_content: self.vue.form_edit_content,
                post_id: self.vue.posts[post_idx].id,
                event_description: self.vue.form_edit_event_description,
                event_location: self.vue.form_edit_event_location,
                start_date: self.vue.form_edit_start_date,
                end_date: self.vue.form_edit_end_date,
                start_time: self.vue.form_edit_start_time,
                end_time: self.vue.form_edit_end_time,
                invite_list: self.vue.form_edit_invite_list,
            },
            function(){
                self.get_posts(self.vue.posts.length)
        });
        self.edit_post_button(post_idx);
        self.vue.edit_post_id = -1;

    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_post: false,
            is_editing_post: false,
            edit_post_id: -1,
            has_more: false,
            logged_in: false,
            posts: [],
            form_post_content: null,
            form_event_description: null,
            form_event_location: null,
            form_start_date: null,
            form_end_date: null,
            form_start_time: null,
            form_end_time: null,
            form_invite_list: null,
            form_edit_content: null,
            user: null,
        },
        methods: {
            get_more: self.get_more,
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            delete_post: self.delete_post,
            edit_post: self.edit_post,
            edit_post_button: self.edit_post_button
        }

    });

    self.get_posts(4);
    $("vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
