var app = function() {

	var self = {};

	Vue.config.silent = false; // show all warnings

	function get_grid_url() {
        //var pp = index;
        return get_grid
    }

    self.get_grid = function() {

        $.getJSON(get_grid_url(), function (data) {
            self.vue.event_grid = data.event_grid;
            self.vue.id = data.id;
            self.vue.height = data.height;
            self.vue.width = data.width;
            self.vue.invite_list = data.invite_list,
            self.vue.user_email = data.user_email,
            self.vue.author_email = data.author_email,
            //alert(self.vue.event_grid);
            self.vue.load_grid();
            
        })
        

    };

    function update_grid() {
        var temp = ""

        for (var i = 0; i < self.vue.event_grid.length; i ++) {
            temp = temp + "," + self.vue.event_grid[i]
        }

        $.post(update_grid_url,
            {
                event_grid: temp
            },
            function(){
                self.vue.get_grid();
                self.vue.load_grid();
        });

    };

    self.change_color = function(x, y, z, width) {
        //self.vue.get_grid();
        //alert(self.vue.event_grid);
        var td = document.getElementById(x + " " + y + " " + z);
        var n = document.getElementById("n" + " " + x + " " + y + " " + z);
        
        index = parseInt(x) * (width + 1) + parseInt(y);
        templist = self.vue.invite_list.split(", ");
        
        if (self.vue.author_email == self.vue.user_email) {
            name_index = templist.length;
        }else {
            name_index = templist.indexOf(self.vue.user_email);
        }

        var line = self.vue.event_grid[index].split(" ");
        var temp1 = line[0].split("");
        var temp2 = line[1].split("");

        var temp = "";
        var green = true;
        var counter = 0;


        if (z == "00") {    
            if (temp1[name_index] == "0") {
                temp1[name_index] = "1";
            }else {
                temp1[name_index] = "0"
            }   
            temp = temp1.join("");


        }else {
            if (temp2[name_index] == "0") {
                temp2[name_index] = "1";
            }else {
                temp2[name_index] = "0"
            }
            temp = temp2.join(""); 
        }
        temp1 = temp1.join("");
        temp2 = temp2.join("");


        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == "1") {
                counter++;
            }else {
                green = false;
            }
        }

        
        line = temp1 + " " + temp2;
        self.vue.event_grid[index] = line;

        //console.log(line);


        if (green) {
            td.style.backgroundColor = 'lightgreen';

        } else {
            td.style.backgroundColor = '';
        }
        n.innerHTML = counter;
        //alert(self.vue.event_grid);
        update_grid();
             

	};

    self.load_grid = function() {
       //alert(self.vue.event_grid)
        //self.vue.get_grid();

        invitelist_size = self.vue.invite_list.split(", ").length;
        
        for (var x = 0; x < self.vue.height + 1; x++) {
            for (var y = 0; y < self.vue.width + 1; y++) {
                var td1 = document.getElementById(x + " " + y + " " + "00");
                var n1 = document.getElementById("n" + " " + x + " " + y + " " + "00");
                var td2 = document.getElementById(x + " " + y + " " + "30");
                var n2 = document.getElementById("n" + " " + x + " " + y + " " + "30");

                index = parseInt(x) * (self.vue.width + 1) + parseInt(y);
                var line = self.vue.event_grid[index].split(" ");
                var temp1 = line[0];
                var temp2 = line[1];
                var temp = "";
                var green1 = true;
                var green2 = true;
                var counter1 = 0;
                var counter2 = 0;

                for (var i = 0; i < temp1.length; i++) {
                    if (temp1[i] == "1") {
                        counter1++;
                    }else {
                        green1 = false;
                    }
                }

                for (var i = 0; i < temp2.length; i++) {
                    if (temp2[i] == "1") {
                        counter2++;
                    }else {
                        green2 = false;
                    }
                }

                if (green1) {
                    td1.style.backgroundColor = 'lightgreen';
                } else {
                    td1.style.backgroundColor = '';
                }
                n1.innerHTML = counter1;

                if (green2) {
                    td2.style.backgroundColor = 'lightgreen';
                } else {
                    td2.style.backgroundColor = '';
                }
                n2.innerHTML = counter2;
            }
        }
    }

    self.show_intervals = function(width, height) {
        //console.log("width = " + width + " height = " + height);
        
        for (var x = 0; x < height + 1; x++) {
            
            var tr = document.getElementById(x + " 30");
            if (tr.style.display == 'none'){
                tr.style.display = '';
            }else {
                tr.style.display = 'none';
            }       
            
        }

    };

	self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            height: 0,
            width: 0,
            event_grid: null,
            id: null,
            invite_list: null,
            user_email: null,
            author_email: null,
            
        },
        methods: {
            change_color: self.change_color,
            show_intervals: self.show_intervals,
            get_grid: self.get_grid,
            load_grid: self.load_grid,
            //to_grid: self.to_grid,
            
        }

    });

    self.vue.get_grid();
    //self.vue.load_grid();
    //alert(self.vue.event_grid);
    $("#vue-div").show();

	return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
