# These are the controllers for your ajax api.

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

#Converting the datetime into a "humane" time representation.
#Source from: http://stackoverflow.com/questions/1551382/user-friendly-time-format-in-python
def pretty_date(time=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    from datetime import datetime
    now = datetime.utcnow()
    if type(time) is int:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time,datetime):
        diff = now - time
    elif not time:
        diff = now - now
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return "a minute ago"
        if second_diff < 3600:
            return str(second_diff / 60) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str(second_diff / 3600) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff / 7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff / 30) + " months ago"
    return str(day_diff / 365) + " years ago"
import time

def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    posts = []
    has_more = False
    post = db().select(db.post.ALL, orderby=~db.post.created_on, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(post):
        if i < end_idx - start_idx:
            p = dict(
                id = r.id,
                post_content = r.post_content,
                event_description = r.event_description,
                start_date = r.start_date,
                end_date = r.end_date,
                start_time = r.start_time,
                end_time = r.end_time,
                user_email = r.user_email,
                created_on = pretty_date(r.created_on),
                user_name = get_user_name_from_email(r.user_email),
                updated_on = pretty_date(r.updated_on),
            )
            posts.append(p)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    if logged_in:
        user = auth.user.email
    else:
        user = ""
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
        user=user,
    ))
    

# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    p_id = db.post.insert(
        post_content = request.vars.post_content,
        event_description = request.vars.event_description,
        start_date = request.vars.start_date,
        end_date = request.vars.end_date,
        start_time = request.vars.start_time,
        end_time = request.vars.end_time
    )
    p = db.post(p_id)
    return response.json(dict(post=p))


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.post_id).delete()
    return response.json(dict())


@auth.requires_signature()
def edit_post():
    """Used to delete a post."""
    # Implement me!
    q = ((db.post.user_email == auth.user.email) &
            (db.post.id == request.vars.post_id)) 
    post = db(q).select().first()

    post.updated_on = datetime.datetime.utcnow()
    post.update_record()
    post.post_content = request.vars.post_content
    post.event_description = request.vars.event_description
    post.start_date = request.vars.start_date
    post.end_date = request.vars.end_date
    post.start_time = request.vars.start_time
    post.end_time = request.vars.end_time
    post.update_record()

    return response.json(dict())