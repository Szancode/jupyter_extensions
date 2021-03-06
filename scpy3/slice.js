(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
};
var _pyfunc_contains = function contains (a, b) { // nargs: 2
    if (b == null) {
    } else if (Array.isArray(b)) {
        for (var i=0; i<b.length; i++) {if (_pyfunc_equals(a, b[i]))
                                           return true;}
        return false;
    } else if (b.constructor === Object) {
        for (var k in b) {if (a == k) return true;}
        return false;
    } else if (b.constructor == String) {
        return b.indexOf(a) >= 0;
    } var e = Error('Not a container: ' + b); e.name='TypeError'; throw e;
};
var _pyfunc_enumerate = function (iter) { // nargs: 1
    var i, res=[];
    if ((typeof iter==="object") && (!Array.isArray(iter))) {iter = Object.keys(iter);}
    for (i=0; i<iter.length; i++) {res.push([i, iter[i]]);}
    return res;
};
var _pyfunc_equals = function equals (a, b) { // nargs: 2
    if (a == null || b == null) {
    } else if (Array.isArray(a) && Array.isArray(b)) {
        var i = 0, iseq = a.length == b.length;
        while (iseq && i < a.length) {iseq = equals(a[i], b[i]); i+=1;}
        return iseq;
    } else if (a.constructor === Object && b.constructor === Object) {
        var akeys = Object.keys(a), bkeys = Object.keys(b);
        akeys.sort(); bkeys.sort();
        var i=0, k, iseq = equals(akeys, bkeys);
        while (iseq && i < akeys.length) {k=akeys[i]; iseq = equals(a[k], b[k]); i+=1;}
        return iseq;
    } return a == b;
};
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;} 
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
};
var _pymeth_append = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.append.apply(this, arguments);
    this.push(x);
};
var _pymeth_endswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.endswith.apply(this, arguments);
    return this.lastIndexOf(x) == this.length - x.length;
};
var _pymeth_find = function (x, start, stop) { // nargs: 1 2 3
    if (this.constructor !== String) return this.find.apply(this, arguments);
    start = (start === undefined) ? 0 : start;
    stop = (stop === undefined) ? this.length : stop;
    start = Math.max(0, ((start < 0) ? this.length + start : start));
    stop = Math.min(this.length, ((stop < 0) ? this.length + stop : stop));
    var i = this.slice(start, stop).indexOf(x);
    if (i >= 0) return i + start;
    return -1;
};
var _pymeth_get = function (key, d) { // nargs: 1 2
    if (this.constructor !== Object) return this.get.apply(this, arguments);
    if (this[key] !== undefined) {return this[key];}
    else if (d !== undefined) {return d;}
    else {return null;}
};
var _pymeth_replace = function (s1, s2, count) {  // nargs: 2 3
    if (this.constructor !== String) return this.replace.apply(this, arguments);
    var i = 0, i2, parts = [];
    count = (count === undefined) ? 1e20 : count;
    while (count > 0) {
        i2 = this.indexOf(s1, i);
        if (i2 >= 0) {
            parts.push(this.slice(i, i2));
            parts.push(s2);
            i = i2 + s1.length;
            count -= 1;
        } else break;
    }
    parts.push(this.slice(i));
    return parts.join('');
};
var _pymeth_split = function (sep, count) { // nargs: 0, 1 2
    if (this.constructor !== String) return this.split.apply(this, arguments);
    if (sep === '') {var e = Error('empty sep'); e.name='ValueError'; throw e;}
    sep = (sep === undefined) ? /\s/ : sep;
    count = Math.max(0, (count === undefined) ? 1e20 : count);
    var parts = this.split(sep);
    var limit = Math.max(0, count);
    var res = parts.slice(0, limit);
    if (count < parts.length) res.push(parts.slice(limit).join(sep));
    return res;
};
var _pymeth_startswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.startswith.apply(this, arguments);
    return this.indexOf(x) == 0;
};
var _pymeth_strip = function (chars) { // nargs: 0 1
    if (this.constructor !== String) return this.strip.apply(this, arguments);
    chars = (chars === undefined) ? ' \t\r\n' : chars;
    var i, s1 = this, s2 = '', s3 = '';
    for (i=0; i<s1.length; i++) {
        if (chars.indexOf(s1[i]) < 0) {s2 = s1.slice(i); break;}
    } for (i=s2.length-1; i>=0; i--) {
        if (chars.indexOf(s2[i]) < 0) {s3 = s2.slice(0, i+1); break;}
    } return s3;
};
var imports, load;
imports = ["base/js/namespace", "base/js/dialog", "services/config", "base/js/utils", "require"];
load = function (Jupyter, dialog, configmod, utils, require) {
    var T, config, config_save, firstline, main, register_actions, remove_firstline, show_dialog, show_message, slice_config, typeahead_form;
    remove_firstline = (function (text) {
        return text.slice(_pymeth_find.call(text, "\n") + 1);
    }).bind(this);

    firstline = (function (text) {
        return _pymeth_split.call(text, "\n")[0];
    }).bind(this);

    show_message = (function (message, wait) {
        var notification_widget;
        notification_widget = Jupyter.notification_area.widget("notebook");
        notification_widget.set_message(message, wait);
        return null;
    }).bind(this);

    typeahead_form = (function () {
        var before_close, container, field, form, input_, mod, nb, on_show, search_button;
        nb = Jupyter.notebook;
        form = new T("form");
        container = new T("div.typeahead-container");
        field = new T("div.typeahead-field");
        input_ = (new T("input")).attr("type", "search");
        search_button = (new T("button", new T("span.typeahead-search-icon"))).attr("type", "submit");
        _pymeth_append.call(field, (new T("span.typeahead-query", input_)));
        _pymeth_append.call(field, (new T("span.typeahead-button", search_button)));
        _pymeth_append.call(container, field);
        _pymeth_append.call(form, container);
        mod = new T("div.modal cmd-palette", new T("div.modal-dialog", new T("div.modal-content", new T("div.modal-body", form))));
        mod.modal({"show": false, "backdrop": true});
        on_show = (function () {
            var focus;
            focus = (function () {
                input_.focus();
                return null;
            }).bind(this);

            setTimeout(focus, 100);
            return null;
        }).bind(this);

        mod.on("show.bs.modal", on_show);
        nb.keyboard_manager.disable();
        before_close = (function () {
            var cell;
            if (_pyfunc_truthy(before_close.ok)) {
                return null;
            }
            cell = nb.get_selected_cell();
            if (_pyfunc_truthy(cell)) {
                cell.select();
            }
            if (_pyfunc_truthy(nb.keyboard_manager)) {
                nb.keyboard_manager.enable();
                nb.keyboard_manager.command_mode();
            }
            before_close.ok = true;
            return null;
        }).bind(this);

        mod.on("hide.bs.modal", before_close);
        return [mod, input_];
    }).bind(this);

    config_save = (function (config) {
        var url;
        url = config.api_url();
        utils.promising_ajax(url, {"cache": false, "type": "PUT", "data": JSON.stringify(config.data), "contentType": "application/json"});
        return null;
    }).bind(this);

    show_dialog = (function (title, body, open_callback, buttons) {
        var button, buttons_setting, callback, dialog_settings, dummy1_sequence, dummy2_iter, dummy3_target;
        open_callback = (open_callback === undefined) ? null: open_callback;
        buttons = (buttons === undefined) ? null: buttons;
        dialog_settings = {"notebook": Jupyter.notebook, "keyboard_manager": Jupyter.keyboard_manager, "title": title, "body": body};
        if ((open_callback !== null)) {
            dialog_settings["open"] = open_callback;
        }
        if ((buttons !== null)) {
            buttons_setting = {};
            dummy1_sequence = buttons;
            if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
                dummy1_sequence = Object.keys(dummy1_sequence);
            }
            for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
                dummy3_target = dummy1_sequence[dummy2_iter];
                button = dummy3_target[0]; callback = dummy3_target[1];
                buttons_setting[button] = {"class": "btn-primary", "click": callback};
            }
            dialog_settings["buttons"] = buttons_setting;
        }
        dialog.modal(dialog_settings);
        return null;
    }).bind(this);

    register_actions = (function (actions, target) {
        var action, dummy4_sequence, key, km;
        target = (target === undefined) ? "command": target;
        km = Jupyter.keyboard_manager;
        dummy4_sequence = actions;
        for (key in dummy4_sequence) {
            if (!dummy4_sequence.hasOwnProperty(key)){ continue; }
            action = dummy4_sequence[key];
            key = _pymeth_replace.call(key, "_", "-");
            km.actions.register(action, key, "scpy3");
            km[target + "_shortcuts"].add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    T = (function (tagname) {
        var args, child, dummy5_, dummy6_sequence, dummy7_iter, el, klass;
        args = Array.prototype.slice.call(arguments).slice(1);
        klass = null;
        if (_pyfunc_truthy(_pyfunc_contains(".", tagname))) {
            dummy5_ = _pymeth_split.call(tagname, ".");
            tagname = dummy5_[0];klass = dummy5_[1];
        }
        el = jQuery("<" + tagname + "/>");
        if ((klass !== null)) {
            el.addClass(klass);
        }
        dummy6_sequence = args;
        if ((typeof dummy6_sequence === "object") && (!Array.isArray(dummy6_sequence))) {
            dummy6_sequence = Object.keys(dummy6_sequence);
        }
        for (dummy7_iter = 0; dummy7_iter < dummy6_sequence.length; dummy7_iter += 1) {
            child = dummy6_sequence[dummy7_iter];
            _pymeth_append.call(el, child);
        }
        return el;
    }).bind(this);

    config = new configmod.ConfigSection("scpy3_slices", {base_url: utils.get_body_data("baseUrl")});
    config.load();
    slice_config = new configmod.ConfigWithDefaults(config, {"slices": {}});
    main = (function () {
        var actions, km, load_slice, save_cell_as_slice;
        km = Jupyter.keyboard_manager;
        save_cell_as_slice = (function () {
            var cell, code, el_body, el_code, el_help, el_name, key, nb, on_key, on_ok, on_open;
            nb = Jupyter.notebook;
            cell = nb.get_selected_cell();
            code = cell.get_text();
            on_open = (function () {
                el_name.focus();
                return null;
            }).bind(this);

            on_ok = (function () {
                var add_slice, code, dummy8_, group, name, text;
                text = el_name.val();
                if (_pyfunc_truthy(_pyfunc_contains(":", text))) {
                    dummy8_ = _pymeth_split.call(text, ":");
                    group = dummy8_[0];name = dummy8_[1];
                } else {
                    group = "default";
                    name = text;
                }
                group = _pymeth_strip.call(group);
                name = _pymeth_strip.call(name);
                code = el_code.text();
                add_slice = (function (slices) {
                    var key;
                    key = _pyfunc_add((group + ":"), name);
                    slices[key] = {"name": name, "group": group, "code": code};
                    slice_config.set("slices", slices);
                    show_message("slice " + key + " added", 2000);
                    return null;
                }).bind(this);

                _pymeth_get.call(slice_config, "slices").then(add_slice);
                return null;
            }).bind(this);

            el_name = T("input").attr("id", "scpy3-slice-name");
            on_key = (function (event) {
                if (_pyfunc_equals(event.which, 13)) {
                    (_pymeth_find.call((jQuery("#scpy3-slice-name").parents("div.modal-dialog")), "button.btn-default")).click();
                }
                return null;
            }).bind(this);

            el_name.on("keypress", on_key);
            el_help = jQuery("<p>input slice name as \"group name : slice name\"</p>");
            if (_pyfunc_truthy(_pymeth_startswith.call(code, "#%"))) {
                console.log(firstline(code));
                key = firstline(code).slice(2);
                el_name.val(key);
                code = remove_firstline(code);
            }
            el_code = T("pre").text(code);
            el_body = T("div", el_help, el_name, jQuery("<br/>"), el_code);
            show_dialog("Save as Slice", el_body, on_open, [["Ok", on_ok]]);
            return null;
        }).bind(this);

        load_slice = (function () {
            var dummy9_, input_, mod, nb, on_key, on_mouse_enter, on_mouse_leave, on_navigate_after, on_result, on_submit, show_search, typeahead;
            typeahead = null;
            nb = Jupyter.notebook;
            dummy9_ = typeahead_form();
            mod = dummy9_[0];input_ = dummy9_[1];
            input_.attr("id", "scpy3-slice-typeahead");
            on_key = (function (event) {
                var dummy10_else, dummy11_sequence, dummy12_iter, dummy13_target, i, item, items, key, remove_slice, res;
                console.log(event);
                if ((_pyfunc_equals(event.shiftKey, true) && _pyfunc_equals(event.ctrlKey, true) && _pyfunc_equals(event.keyCode, 11))) {
                    items = (_pymeth_find.call(typeahead.resultContainer, "li:not(.typeahead-group)")).toArray();
                    dummy10_else = true;
                    dummy11_sequence = _pyfunc_enumerate(items);
                    if ((typeof dummy11_sequence === "object") && (!Array.isArray(dummy11_sequence))) {
                        dummy11_sequence = Object.keys(dummy11_sequence);
                    }
                    for (dummy12_iter = 0; dummy12_iter < dummy11_sequence.length; dummy12_iter += 1) {
                        dummy13_target = dummy11_sequence[dummy12_iter];
                        i = dummy13_target[0]; item = dummy13_target[1];
                        if (_pyfunc_truthy(jQuery(item).hasClass("active"))) {
                            res = typeahead.result[i];
                            jQuery(item).fadeTo("fast", 0.4);
                            dummy10_else = false; break;
                        }
                    } if (dummy10_else) {
                        return null;
                    }
                    key = _pyfunc_add((res.group + ":"), res.display);
                    remove_slice = (function (slices) {
                        delete config.data.slices[key];
                        config_save(config);
                        show_message("slice " + key + " removed", 2000);
                        return null;
                    }).bind(this);

                    _pymeth_get.call(slice_config, "slices").then(remove_slice);
                    return true;
                }
                return null;
            }).bind(this);

            input_.on("keypress", on_key);
            on_submit = (function (node, query, result, result_count) {
                var cell, code;
                mod.modal("hide");
                cell = nb.get_selected_cell();
                if ((!_pyfunc_equals(cell.cell_type, "code"))) {
                    cell = nb.insert_cell_below("code");
                }
                code = cell.get_text();
                if ((!_pyfunc_truthy(_pymeth_endswith.call(code, "\n")))) {
                    code=_pyfunc_add(code, "\n")
                }
                cell.set_text(_pyfunc_add(code, result.code));
                cell.select();
                return null;
            }).bind(this);

            on_result = (function (node, query, result, result_count) {
                return null;
            }).bind(this);

            on_mouse_enter = (function (node, a, item, event) {
                var pre;
                pre = jQuery("pre", a);
                pre.text(item.code);
                return null;
            }).bind(this);

            on_mouse_leave = (function (node, a, item, event) {
                var pre;
                pre = jQuery("pre", a);
                pre.text(item.firstline);
                return null;
            }).bind(this);

            on_navigate_after = (function (node, lis, a, item, query, event) {
                console.log(node, lis, a, item, query, event);
                return null;
            }).bind(this);

            show_search = (function (slices) {
                var dummy14_sequence, group, item, src;
                src = {};
                dummy14_sequence = slices;
                for (item in dummy14_sequence) {
                    if (!dummy14_sequence.hasOwnProperty(item)){ continue; }
                    item = dummy14_sequence[item];
                    group = item["group"];
                    if (_pyfunc_truthy(!_pyfunc_contains(group, src))) {
                        src[group] = {"data": [], "display": "display"};
                    }
                    _pymeth_append.call((src[group]["data"]), {"display": item.name, "group": item.group, "code": item.code, "firstline": _pymeth_split.call(item.code, "\n")[0]});
                }
                typeahead = input_.typeahead({"emptyTemplate": "No result", "maxItem": 1000, "minLength": 0, "hint": true, "group": ["group", "{{group}}"], "searchOnFocus": true, "mustSelectItem": true, "template": "<strong>{{display}}</strong><br/><pre style=\"background-color: transparent;\">{{firstline}}</pre>", "order": "asc", "source": src, "callback": {"onSubmit": on_submit, "onClickAfter": on_submit, "onResult": on_result, "onMouseEnter": on_mouse_enter, "onMouseLeave": on_mouse_leave, "onNavigateAfter": on_navigate_after}, "debug": false});
                mod.modal("show");
                return null;
            }).bind(this);

            _pymeth_get.call(slice_config, "slices").then(show_search);
            return null;
        }).bind(this);

        actions = {save_current_cell_as_slice:{"help": "save current cell as slice", "icon": "fa-star", "key": "Alt-i", handler: save_cell_as_slice}, insert_a_slice:{"help": "insert a slice", "icon": "fa-book", "key": "Alt-l", handler: load_slice}};
        register_actions(actions);
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()