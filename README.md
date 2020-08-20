# Shortener

Yet another URL Shortener

## Feature

- Shorten URL
- Custom URL
- Password protected URL

## How to Use

- Just go to `/` for demo you can go to [here](https://shortener-nu.vercel.app/)

## Api Documentation

- `/api/short/all` : [GET] all shortened link
- `/api/create` : [POST] create a new shortened link

```
{
  real_link: string, // valid URL
  desired_link: string , // alphanumeric
}
```

- `/api/?link={shortened link}` - [GET] get destined link

## TODO

- [x] Set Initial Shortener App
- [x] Handle error
- [x] Add password protection
- [ ] Add share button

## Stack

- Next JS
- Mongo DB

###### PS:

- <small>this is my first time using Next JS and vercel</small>
