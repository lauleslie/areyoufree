# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])


def index():
    """
    This is your main controller.  Here you do almost nothing; you just cause index.html to be served.
    """
    return dict()

def date_convert(month, day, year):
    if (month == 4 or month == 6 or month == 9 or month == 11) and day > 30:
        month += 1
        day = day % 30
    elif (month == 1 or month == 3 or month == 5 or month == 7 or month == 8 or month == 10 or month == 12) and day > 31:
        month += 1
        day = day % 31
        #logger.info("case 2")
    elif month == 2 and day > 28:
        if year % 4 == 0 and day > 29:
            day = day % 29
        elif year % 4 != 0:
            day = day % 28
        month += 1

    if month > 12:
        month = month % 12

    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    date = str(months[month - 1]) + " " + str(day) + ", " + str(year)
    return date


@auth.requires_login()
def edit():
    """
    This is the page to create / edit / delete a post.
    """
    return dict()

def event():

    from datetime import datetime as dt, date, time

    post_id = request.vars.id

    if auth.user is None:
        session.flash = T('not logged in')
        redirect(URL("default", "index"))

    q = (db.post.id == post_id)
    post = db(q).select().first()

    invited = False



    if auth.user.email != post.user_email:

        for email in post.invite_list.split(", "):
            logger.info(email)
            if auth.user.email == email:
                invited = True

        if not (invited):
            session.flash = T('Sorry, you are not invited to this event.')
            redirect(URL("default", "index"))




    start_day = post.start_date
    end_day = post.end_date

    start_time = post.start_time
    end_time = post.end_time

    start_timetemp = dt.combine(date.min, start_time) - dt.combine(date.min, datetime.time(0, 0,))
    start = start_timetemp.seconds /3600


    width = (end_day - start_day).days


    height1 = dt.combine(date.min, end_time) - dt.combine(date.min, start_time)
    height = height1.seconds / 3600

    #logger.info(post.event_grid)



    #height = end_time - dt.fromtimestamp(start_time)




    #matrix = [[0 for y in range(end_time - start_time)] for x in range(end_day - start_day)]


    return dict(height=height, width=width, start_time=start, start_day=start_day.day, start_month=start_day.month,
        start_year=start_day.year, date_convert=date_convert, id=post_id,)



def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()
