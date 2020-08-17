# Shortener
Yet another URL Shortener

## How to Use
- Just go to `/` for demo you can go to [TBD]

## Api Documentation
- `/api/short/all` : [GET] all shortened link
- `/api/create` : [POST]  create a new shortened link
```
{
  real_link: string, // valid URL
  desired_link: string , // alphanumeric
}
```
- `/api/?link={shortened link}` - [GET] get destined link


## Stack
- Next JS
- Mongo DB

<small>PS: this is my first time using Next JS</small>