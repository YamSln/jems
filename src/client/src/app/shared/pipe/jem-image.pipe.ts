import { Pipe, PipeTransform } from '@angular/core';
import { WordType } from '../../../../../model/word.type';
import { Team } from '../../../../../model/team.model';

const jemImages: string[] = [
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiDQoJeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KCXhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojODJEMkZGOyIgcG9pbnRzPSIyNTYsMCAzNC4yOTcsMTI4IDM0LjI5NywzODQgMjU2LDUxMiA0NzcuNzAzLDM4NCA0NzcuNzAzLDEyOCAiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojMDhCN0ZDOyIgcG9pbnRzPSIyNTYsMjU2IDI1NiwwIDM0LjI5NywxMjggIi8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzgyRDJGRjsiIGQ9Ik0yNTYsMjU2TDI1NiwyNTZMMjU2LDI1NnoiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojMDA2REZGOyIgcG9pbnRzPSIzNC4yOTcsMTI4IDM0LjI5NywzODQgMjU2LDI1NiAiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojMDhCN0ZDOyIgcG9pbnRzPSI0NzcuNzAzLDEyOCA0NzcuNzAzLDEyOCAyNTYsMjU2IDI1NiwyNTYgNDc3LjcwMywzODQgNDc3LjcwMywzODQgIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAwNTBDMDsiIHBvaW50cz0iMjU2LDI1NiAzNC4yOTcsMzg0IDI1Niw1MTIgIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAwNkRGRjsiIHBvaW50cz0iMjU2LDUxMiA0NzcuNzAzLDM4NCAyNTYsMjU2ICIvPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiM4MkQyRkY7IiBwb2ludHM9IjM4MS4xMjEsMzI4LjIzOCAzODEuMTIxLDE4My43NjIgMjU2LDExMS41MjMgMTMwLjg3OSwxODMuNzYyIDEzMC44NzksMzI4LjIzOCAyNTYsNDAwLjQ3NyANCgkiLz4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojNTVDQkZGOyIgcG9pbnRzPSIzODEuMTIxLDMyOC4yMzggMzgxLjEyMSwxODMuNzYyIDI1NiwxMTEuNTIzIDI1Niw0MDAuNDc3ICIvPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KPC9zdmc+DQo=',
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiDQoJeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KCXhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRjAzMDNFOyIgcG9pbnRzPSIzMjYuMzY3LDE1Ny4zOTUgMzI2LjM2NywzNTQuNjA1IDQzOC4yMDMsMzgxLjgzOCA0MzguMjAzLDEzMC4xNjIgIi8+DQoJPGc+DQoJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRjUxNUU7IiBwb2ludHM9IjM0Ni4zODMsMTc3LjQxMSA0MzguMjAzLDEzMC4xNjIgMjU2LDAgMjM1Ljk4NCwxMzIuODU5IAkiLz4NCgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZGNTE1RTsiIHBvaW50cz0iMjM1Ljk4NCwzNzkuMTQxIDI1Niw1MTIgNDM4LjIwMywzODEuODM4IDM0Ni4zODMsMzM0LjU4OSAJIi8+DQoJPC9nPg0KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRjg4OTE7IiBwb2ludHM9IjI1NiwxMTIuODQzIDIzNS45ODQsMjU2IDI1NiwzOTkuMTU3IDM0Ni4zODMsMzM0LjU4OSAzNDYuMzgzLDE3Ny40MTEgIi8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZGQzlDQzsiIHBvaW50cz0iMTQ1LjYwMSwxNTcuMzk1IDE0NS42MDEsMzU0LjYwNSAyNTYsMzk5LjE1NyAyNTYsMTEyLjg0MyAiLz4NCgk8Zz4NCgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZGODg5MTsiIHBvaW50cz0iMTY1LjYxNywzMzQuNTg5IDExNC41OTEsMzMxIDczLjc5NywzODEuODM4IDI1Niw1MTIgMjU2LDM5OS4xNTcgCSIvPg0KCQk8cG9seWdvbiBzdHlsZT0iZmlsbDojRkY4ODkxOyIgcG9pbnRzPSIyNTYsMTEyLjg0MyAyNTYsMCA3My43OTcsMTMwLjE2MiAxMTQuNTkxLDE4Mi4zMzMgMTY1LjYxNywxNzcuNDExIAkiLz4NCgk8L2c+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZGNTE1RTsiIHBvaW50cz0iMTY1LjYxNywxNzcuNDExIDczLjc5NywxMzAuMTYyIDczLjc5NywzODEuODM4IDE2NS42MTcsMzM0LjU4OSAiLz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCjwvc3ZnPg0K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCA3MiA3MiIgaWQ9ImVtb2ppIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8ZyBpZD0iY29sb3IiPg0KICAgIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik00MC41MjYxLDE2LjkyMDJjLTEuNDA1OC0wLjQyNzEtMi44NjY5LTAuNjQ0NC00LjMzNjEtMC42NDQ5aC0wLjAzMDIgYy0xLjA0ODQsMC4wMDM1LTIuMDkzOSwwLjExMTgtMy4xMjA4LDAuMzIzM2MtMy42MzYzLDAuNzgzLTYuODY2NywyLjg1NDctOS4wOTUyLDUuODMyOCBjLTEuNjk1NiwyLjIyMzEtMi44MTc1LDQuODI5Ni0zLjI2NjUsNy41ODkyYy0wLjkwMTYsNS4xNjczLDAuNTc1NSwxMC40NjU2LDQuMDIwMywxNC40MjEybDAuMTExNCwwLjEyNDggYzAuODgzNiwwLjk5NjcsMi4wOTM5LDIuMzYxOSwyLjA5MzksMy44MTQzbC0wLjAxODQsNC4xNzc4YzAsMC40NjI2LTAuMzc1LDAuODM3Ni0wLjgzNzYsMC44Mzc2bDAsMCBjMS44NjE0LDAuOTUwMSwzLjgzNDQsMS42NjM3LDUuODczLDIuMTI0MWMzLjE5MjQsMC43MTkxLDYuNTEzOSwwLjYyODQsOS42NjIyLTAuMjYzOCBDNDQuMjc1MSw0Mi41NDQ4LDQzLjU2MzksMjkuMjY3Niw0MC41MjYxLDE2LjkyMDJ6Ii8+DQogICAgPHBhdGggZmlsbD0iI0QwQ0ZDRSIgZD0iTTQ2Ljk4MDQsMjAuODEyNGMtMS43OTgzLTEuODA5LTQuMDE1My0zLjE0NjItNi40NTQzLTMuODkzYzMuMDM3OSwxMi4zNDc0LDMuNzQ5LDI1LjYyNTQsMS4wNTM3LDM4LjMzMjEgYzEuNjMtMC40NTU3LDMuMjAzNC0xLjA5MzgsNC42OTA0LTEuOTAyMWMtMC40NjA4LDAuMDAyLTAuODM4NC0wLjM2NTItMC44NDkzLTAuODI1OGwtMC4wNTc4LTQuMTQwMSBjMC0xLjM4MiwxLjE3MjYtMi42NzI3LDIuMDI3Ny0zLjYxNThjMC4xMjE0LTAuMTMzMiwwLjIzNy0wLjI2MDUsMC4zNDA5LTAuMzc5NGM1LjkwNTktNi44NjE2LDUuNTgxOC0xNy4xMDA3LTAuNzQ2My0yMy41NzUgTDQ2Ljk4MDQsMjAuODEyNHoiLz4NCiAgICA8cGF0aCBmaWxsPSIjM0YzRjNGIiBkPSJNMjkuMzY5OCwzNS4yMzk3Yy0yLjIwOTEsMC00LDEuNzkwOS00LDRzMS43OTA5LDQsNCw0czQtMS43OTA5LDQtNFMzMS41Nzg5LDM1LjIzOTcsMjkuMzY5OCwzNS4yMzk3eiIvPg0KICAgIDxwYXRoIGZpbGw9IiMzRjNGM0YiIGQ9Ik00My4wNjIzLDM1LjIzOTdjLTIuMjA5MSwwLTQsMS43OTA5LTQsNHMxLjc5MDksNCw0LDRzNC0xLjc5MDksNC00UzQ1LjI3MTUsMzUuMjM5Nyw0My4wNjIzLDM1LjIzOTd6Ii8+DQogICAgPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTUzLjAxNDgsMjAuNjY1NGMxLjI3MjktMS4yNjQyLDIuMTMyLTIuMTE0NywyLjQxNTctMi4zODk3YzAsMCwxLjk0MzgsMS44MzkzLDMuMjY5NywxLjQ0MjUgYzEuMzczOS0wLjQxMTEsMi4xNTctMS44MDc4LDIuMDM2LTIuOTUzN2MtMC4xNjc3LTEuNTg4OS0yLjExLTMuMDQwMi00LjQzODMtMi41NTY1YzAuNDA1Ny0xLjUxMjYsMC4wNjgyLTMuMDYyMi0wLjkzMzEtMy45OTQ4IGMtMS42NTM5LTEuNTQwNC00LjA3OC0wLjQ3ODctNC45ODk3LDAuOTE3N2MtMS4yMjAzLDEuODY5MSwxLjU3MzQsMy42NjI4LDEuNTczNCwzLjY2MjggYy0wLjI2NTcsMC4yNTc2LTEuMDM1MywxLjAxOTEtMi4xNzYyLDIuMTUxOCIvPg0KICAgIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOS42Nzg1LDQ2LjkwNzljLTEuNTQ5NCwxLjUzOTctMi41OTk4LDIuNTgwMy0yLjkxOTgsMi44OTA1Yy0wLjY1NTMtMS4zMDI3LTIuMTMzLTEuOTQzLTMuNDU4OC0xLjU0NjMgYy0xLjM3MzksMC40MTExLTIuMTU3LDEuODA3OC0yLjAzNiwyLjk1MzdjMC4xNjc3LDEuNTg4OSwyLjExLDMuMDQwMiw0LjQzODMsMi41NTY1Yy0wLjQwNTcsMS41MTI2LTAuMDY4MiwzLjA2MjIsMC45MzMyLDMuOTk0OCBjMS42NTM5LDEuNTQwNCw0LjMyOTQsMC42MTM3LDQuOTg5Ny0wLjkxNzdjMC40NjktMS4wODc5LDAuMTkyNy0yLjI5NzYtMS40MzgzLTMuNTA1MWMwLjI2MDQtMC4yNTI1LDEuMDA1Ny0wLjk4OTgsMi4xMTA4LTIuMDg3Ii8+DQogICAgPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE5LjExMjUsMjAuNzkxN2MtMS4zNDI4LTEuMzMzOS0yLjI0OTgtMi4yMzE5LTIuNTQyOS0yLjUxNjFjMCwwLTEuOTQzOCwxLjgzOTMtMy4yNjk3LDEuNDQyNSBjLTEuMzczOS0wLjQxMTEtMi4xNTctMS44MDc4LTIuMDM2LTIuOTUzN2MwLjE2NzctMS41ODg5LDIuMTEtMy4wNDAyLDQuNDM4My0yLjU1NjVjLTAuNDA1Ny0xLjUxMjYtMC4wNjgyLTMuMDYyMiwwLjkzMzItMy45OTQ4IGMxLjY1MzktMS41NDA0LDQuMDc4LTAuNDc4Nyw0Ljk4OTcsMC45MTc3YzEuMjIwMywxLjg2OTEtMS41NzM1LDMuNjYyOS0xLjU3MzUsMy42NjI5YzAuMjg2MywwLjI3NzYsMS4xNTc1LDEuMTQsMi40NDc4LDIuNDIxNiIvPg0KICAgIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik01Mi40OTY4LDQ3LjA4MjFjMS40NTMzLDEuNDQzOSwyLjQzNjcsMi40MTc5LDIuNzQ0NCwyLjcxNjJjMC42NTUzLTEuMzAyNywyLjEzMy0xLjk0MywzLjQ1ODgtMS41NDYzIGMxLjM3MzksMC40MTExLDIuMTU3LDEuODA3OCwyLjAzNiwyLjk1MzdjLTAuMTY3NywxLjU4ODktMi4xMSwzLjA0MDItNC40MzgzLDIuNTU2NWMwLjQwNTcsMS41MTI2LDAuMDY4MiwzLjA2MjItMC45MzMxLDMuOTk0OCBjLTEuNjUzOSwxLjU0MDQtNC4zMjk0LDAuNjEzNy00Ljk4OTctMC45MTc3Yy0wLjQ2OS0xLjA4NzktMC4xOTI3LTIuMjk3NiwxLjQzODMtMy41MDUxYy0wLjI1NzktMC4yNS0wLjk5MTItMC45NzU1LTIuMDc4Ni0yLjA1NSIvPg0KICA8L2c+DQogIDxnIGlkPSJoYWlyIi8+DQogIDxnIGlkPSJza2luIi8+DQogIDxnIGlkPSJza2luLXNoYWRvdyIvPg0KICA8ZyBpZD0ibGluZSI+DQogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTQ2LjI1NTEsNTIuNDczMyBsLTAuMDU3OC00LjE0MDljMC0xLjIxNDUsMS4zODExLTIuNTQyLDIuMTYwOS0zLjQzNGMyLjg3NjYtMy4zMDYyLDQuNDUxOC03LjU0NjIsNC40MzE2LTExLjkyODYgYzAtOS43MTU4LTcuNDQ5My0xNy41OTQtMTYuNjMwNy0xNy41NzQ3Yy0xLjEwNDIsMC4wMDM1LTIuMjA1MiwwLjExNzctMy4yODY2LDAuMzQwOSBjLTYuNjA4NCwxLjM1NTItMTEuODc0Miw3LjA4MzMtMTMuMDIyNSwxNC4xMDYzYy0wLjk0MzgsNS40MTYyLDAuNjA4MywxMC45Njg5LDQuMjIzOSwxNS4xMTA2IGMwLjc2OCwwLjg2ODYsMS45OTUxLDIuMTk0NCwxLjk5NTEsMy4zODM4bC0wLjAxODQsNC4xNzM2Ii8+DQogICAgPGxpbmUgeDE9IjI5LjM3MDYiIHgyPSIyOS4zNzA2IiB5MT0iNTEuMDgxMiIgeTI9IjU1LjA4NDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgICA8bGluZSB4MT0iMzQuMTU2NSIgeDI9IjM0LjE1NjUiIHkxPSI1MS45NzMzIiB5Mj0iNTUuOTc3NyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPg0KICAgIDxsaW5lIHgxPSI0My4wNjMyIiB4Mj0iNDMuMDYzMiIgeTE9IjUxLjA4MTIiIHkyPSI1NS4wODQ4IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogICAgPGxpbmUgeDE9IjM4LjcyMDQiIHgyPSIzOC43MjA0IiB5MT0iNTEuOTczMyIgeTI9IjU1Ljk3NzciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgICA8cG9seWxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgcG9pbnRzPSIzMy43MDI0LDQ4Ljc0MTkgMzYuMTU4MSw0My44NDMgMzkuMDkzOCw0OC43NDE5Ii8+DQogICAgPGNpcmNsZSBjeD0iMjkuMzcwNiIgY3k9IjM5LjIwMDMiIHI9IjQuMTg3OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIvPg0KICAgIDxjaXJjbGUgY3g9IjQzLjA2MzIiIGN5PSIzOS4yMDAzIiByPSI0LjE4NzgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNTMuMDE0OCwyMC42NjU0IGMxLjI3MjktMS4yNjQyLDIuMTMyLTIuMTE0NywyLjQxNTctMi4zODk3YzAsMCwxLjk0MzgsMS44MzkzLDMuMjY5NywxLjQ0MjVjMS4zNzM5LTAuNDExMSwyLjE1Ny0xLjgwNzgsMi4wMzYtMi45NTM3IGMtMC4xNjc3LTEuNTg4OS0yLjExLTMuMDQwMi00LjQzODMtMi41NTY1YzAuNDA1Ny0xLjUxMjYsMC4wNjgyLTMuMDYyMi0wLjkzMzEtMy45OTQ4Yy0xLjY1MzktMS41NDA0LTQuMDc4LTAuNDc4Ny00Ljk4OTcsMC45MTc3IGMtMS4yMjAzLDEuODY5MSwxLjU3MzQsMy42NjI4LDEuNTczNCwzLjY2MjhjLTAuMjY1NywwLjI1NzYtMS4wMzUzLDEuMDE5MS0yLjE3NjIsMi4xNTE4Ii8+DQogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5LjY3ODUsNDYuOTA3OSBjLTEuNTQ5NCwxLjUzOTctMi41OTk4LDIuNTgwMy0yLjkxOTgsMi44OTA1Yy0wLjY1NTMtMS4zMDI3LTIuMTMzLTEuOTQzLTMuNDU4OC0xLjU0NjNjLTEuMzczOSwwLjQxMTEtMi4xNTcsMS44MDc4LTIuMDM2LDIuOTUzNyBjMC4xNjc3LDEuNTg4OSwyLjExLDMuMDQwMiw0LjQzODMsMi41NTY1Yy0wLjQwNTcsMS41MTI2LTAuMDY4MiwzLjA2MjIsMC45MzMyLDMuOTk0OGMxLjY1MzksMS41NDA0LDQuMzI5NCwwLjYxMzcsNC45ODk3LTAuOTE3NyBjMC40NjktMS4wODc5LDAuMTkyNy0yLjI5NzYtMS40MzgzLTMuNTA1MWMwLjI2MDQtMC4yNTI1LDEuMDA1Ny0wLjk4OTgsMi4xMTA4LTIuMDg3Ii8+DQogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5LjExMjUsMjAuNzkxNyBjLTEuMzQyOC0xLjMzMzktMi4yNDk4LTIuMjMxOS0yLjU0MjktMi41MTYxYzAsMC0xLjk0MzgsMS44MzkzLTMuMjY5NywxLjQ0MjVjLTEuMzczOS0wLjQxMTEtMi4xNTctMS44MDc4LTIuMDM2LTIuOTUzNyBjMC4xNjc3LTEuNTg4OSwyLjExLTMuMDQwMiw0LjQzODMtMi41NTY1Yy0wLjQwNTctMS41MTI2LTAuMDY4Mi0zLjA2MjIsMC45MzMyLTMuOTk0OGMxLjY1MzktMS41NDA0LDQuMDc4LTAuNDc4Nyw0Ljk4OTcsMC45MTc3IGMxLjIyMDMsMS44NjkxLTEuNTczNSwzLjY2MjktMS41NzM1LDMuNjYyOWMwLjI4NjMsMC4yNzc2LDEuMTU3NSwxLjE0LDIuNDQ3OCwyLjQyMTYiLz4NCiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNTIuNDk2OCw0Ny4wODIxIGMxLjQ1MzMsMS40NDM5LDIuNDM2NywyLjQxNzksMi43NDQ0LDIuNzE2MmMwLjY1NTMtMS4zMDI3LDIuMTMzLTEuOTQzLDMuNDU4OC0xLjU0NjNjMS4zNzM5LDAuNDExMSwyLjE1NywxLjgwNzgsMi4wMzYsMi45NTM3IGMtMC4xNjc3LDEuNTg4OS0yLjExLDMuMDQwMi00LjQzODMsMi41NTY1YzAuNDA1NywxLjUxMjYsMC4wNjgyLDMuMDYyMi0wLjkzMzEsMy45OTQ4Yy0xLjY1MzksMS41NDA0LTQuMzI5NCwwLjYxMzctNC45ODk3LTAuOTE3NyBjLTAuNDY5LTEuMDg3OS0wLjE5MjctMi4yOTc2LDEuNDM4My0zLjUwNTFjLTAuMjU3OS0wLjI1LTAuOTkxMi0wLjk3NTUtMi4wNzg2LTIuMDU1Ii8+DQogIDwvZz4NCjwvc3ZnPg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjExIiBoZWlnaHQ9IjIzNiINCiAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPg0KICAgIDxkZWZzPg0KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAwIj4NCiAgICAgICAgICAgIDxyZWN0IHg9IjQ2NyIgeT0iMTg0IiB3aWR0aD0iMjExIiBoZWlnaHQ9IjIzNiIvPg0KICAgICAgICA8L2NsaXBQYXRoPg0KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAxIj4NCiAgICAgICAgICAgIDxyZWN0IHg9IjQ2NyIgeT0iMTg3IiB3aWR0aD0iMTE1IiBoZWlnaHQ9IjIyOSIvPg0KICAgICAgICA8L2NsaXBQYXRoPg0KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAyIj4NCiAgICAgICAgICAgIDxyZWN0IHg9IjQ2NyIgeT0iMTg3IiB3aWR0aD0iMTE1IiBoZWlnaHQ9IjIyOSIvPg0KICAgICAgICA8L2NsaXBQYXRoPg0KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXAzIj4NCiAgICAgICAgICAgIDxyZWN0IHg9IjQ2NyIgeT0iMTg3IiB3aWR0aD0iMjMwIiBoZWlnaHQ9IjIyOSIvPg0KICAgICAgICA8L2NsaXBQYXRoPg0KICAgICAgICA8Y2xpcFBhdGggaWQ9ImNsaXA0Ij4NCiAgICAgICAgICAgIDxyZWN0IHg9IjU4MiIgeT0iMTg1IiB3aWR0aD0iOTUiIGhlaWdodD0iMjM0Ii8+DQogICAgICAgIDwvY2xpcFBhdGg+DQogICAgICAgIDxjbGlwUGF0aCBpZD0iY2xpcDUiPg0KICAgICAgICAgICAgPHJlY3QgeD0iNTgyIiB5PSIxODUiIHdpZHRoPSI5NSIgaGVpZ2h0PSIyMzQiLz4NCiAgICAgICAgPC9jbGlwUGF0aD4NCiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwNiI+DQogICAgICAgICAgICA8cmVjdCB4PSI0NjEiIHk9IjE4NSIgd2lkdGg9IjIzNCIgaGVpZ2h0PSIyMzQiLz4NCiAgICAgICAgPC9jbGlwUGF0aD4NCiAgICA8L2RlZnM+DQogICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ2NyAtMTg0KSI+DQogICAgICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMSkiPg0KICAgICAgICAgICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAyKSI+DQogICAgICAgICAgICAgICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAzKSI+DQogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMTQuNSAwIDE1LjMzOTkgNTcuMjUgMTUuMzM5OSAxNzEuNzUgMTE0LjUgMjI5IDIxMy42NiAxNzEuNzUgMjEzLjY2IDU3LjI1WiIgZmlsbD0iIzgyRDJGRiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LjUgMTE0LjUgMTE0LjUgMCAxNS4zMzk5IDU3LjI1WiIgZmlsbD0iIzA4QjdGQyIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUuMzM5OSA1Ny4yNSAxNS4zMzk5IDE3MS43NSAxMTQuNSAxMTQuNVoiIGZpbGw9IiMwMDZERkYiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDA0MzcgMCAwIDEgNDY3IDE4NykiLz4NCiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIxMy42NiA1Ny4yNSAyMTMuNjYgNTcuMjUgMTE0LjUgMTE0LjUgMTE0LjUgMTE0LjUgMjEzLjY2IDE3MS43NSAyMTMuNjYgMTcxLjc1WiIgZmlsbD0iIzA4QjdGQyIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LjUgMTE0LjUgMTUuMzM5OSAxNzEuNzUgMTE0LjUgMjI5WiIgZmlsbD0iIzAwNTBDMCIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LjUgMjI5IDIxMy42NiAxNzEuNzUgMTE0LjUgMTE0LjVaIiBmaWxsPSIjMDA2REZGIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjAwNDM3IDAgMCAxIDQ2NyAxODcpIi8+DQogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNzAuNDYyIDE0Ni44MSAxNzAuNDYyIDgyLjE5MDQgMTE0LjUgNDkuODgwNCA1OC41Mzc3IDgyLjE5MDQgNTguNTM3NyAxNDYuODEgMTE0LjUgMTc5LjEyWiIgZmlsbD0iIzgyRDJGRiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTcwLjQ2MiAxNDYuODEgMTcwLjQ2MiA4Mi4xOTA0IDExNC41IDQ5Ljg4MDQgMTE0LjUgMTc5LjEyWiIgZmlsbD0iIzU1Q0JGRiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDQzNyAwIDAgMSA0NjcgMTg3KSIvPg0KICAgICAgICAgICAgICAgIDwvZz4NCiAgICAgICAgICAgIDwvZz4NCiAgICAgICAgPC9nPg0KICAgICAgICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDQpIj4NCiAgICAgICAgICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwNSkiPg0KICAgICAgICAgICAgICAgIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwNikiPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ5LjA4NCA3MS44OTc4IDE0OS4wODQgMTYxLjk4MyAyMDAuMTcgMTc0LjQyMyAyMDAuMTcgNTkuNDU3OFoiIGZpbGw9IiNGMDMwM0UiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEuMDAwNTEgNDYxLjExNCAxODUpIi8+DQogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNTguMjI3IDgxLjA0MSAyMDAuMTcgNTkuNDU3OCAxMTYuOTQgMCAxMDcuNzk3IDYwLjY4OThaIiBmaWxsPSIjRkY1MTVFIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxLjAwMDUxIDQ2MS4xMTQgMTg1KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTA3Ljc5NyAxNzMuMTkxIDExNi45NCAyMzMuODgxIDIwMC4xNyAxNzQuNDIzIDE1OC4yMjcgMTUyLjg0WiIgZmlsbD0iI0ZGNTE1RSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMS4wMDA1MSA0NjEuMTE0IDE4NSkiLz4NCiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExNi45NCA1MS41NDY1IDEwNy43OTcgMTE2Ljk0IDExNi45NCAxODIuMzM0IDE1OC4yMjcgMTUyLjg0IDE1OC4yMjcgODEuMDQxWiIgZmlsbD0iI0ZGODg5MSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMS4wMDA1MSA0NjEuMTE0IDE4NSkiLz4NCiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY2LjUxMDMgNzEuODk3OCA2Ni41MTAzIDE2MS45ODMgMTE2Ljk0IDE4Mi4zMzQgMTE2Ljk0IDUxLjU0NjVaIiBmaWxsPSIjRkZDOUNDIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxLjAwMDUxIDQ2MS4xMTQgMTg1KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNzUuNjUzNiAxNTIuODQgNTIuMzQ1IDE1MS4yIDMzLjcxMDMgMTc0LjQyMyAxMTYuOTQgMjMzLjg4MSAxMTYuOTQgMTgyLjMzNFoiIGZpbGw9IiNGRjg4OTEiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEuMDAwNTEgNDYxLjExNCAxODUpIi8+DQogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMTYuOTQgNTEuNTQ2NSAxMTYuOTQgMCAzMy43MTAzIDU5LjQ1NzggNTIuMzQ1IDgzLjI4OTQgNzUuNjUzNiA4MS4wNDFaIiBmaWxsPSIjRkY4ODkxIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxLjAwMDUxIDQ2MS4xMTQgMTg1KSIvPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNzUuNjUzNiA4MS4wNDEgMzMuNzEwMyA1OS40NTc4IDMzLjcxMDMgMTc0LjQyMyA3NS42NTM2IDE1Mi44NFoiIGZpbGw9IiNGRjUxNUUiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEuMDAwNTEgNDYxLjExNCAxODUpIi8+DQogICAgICAgICAgICAgICAgPC9nPg0KICAgICAgICAgICAgPC9nPg0KICAgICAgICA8L2c+DQogICAgICAgIDxwYXRoIGQ9Ik02MDQuMDkgMjcyLjc0OEM2MDIuNDk2IDI3My4xNDYgNjAwLjM0IDI3My42NSA1OTcuNjIxIDI3NC4yNTkgNTkzLjIxNSAyNzUuMjQ0IDU4OS44NjMgMjc2LjIxNyA1ODcuNTY2IDI3Ny4xNzcgNTg1LjI2OSAyNzguMTM4IDU4My4xNzIgMjc5LjQyNyA1ODEuMjczIDI4MS4wNDUgNTc3LjI0MiAyODQuNDkgNTc1LjIyNiAyODguMTExIDU3NS4yMjYgMjkxLjkwOCA1NzUuMjI2IDI5NS42MTEgNTc3LjI4OSAyOTguMTU0IDU4MS40MTQgMjk5LjUzNyA1ODguNDQ1IDI4Ni44MSA1OTYuMDA0IDI3Ny44ODEgNjA0LjA5IDI3Mi43NDhaTTYxMy44MjggMjY4LjAwMkM2MTQuMTU2IDI2OC4wMDIgNjE0LjMyIDI2OC4xMzEgNjE0LjMyIDI2OC4zODggNjE0LjMyIDI2OC43NCA2MTMuMzgzIDI2OS4zNDkgNjExLjUwOCAyNzAuMjE3IDYwOS41NjIgMjcxLjA4NCA2MDcuNDI5IDI3MS44MzQgNjA1LjEwOSAyNzIuNDY3IDYwMS4wNzggMjc1LjgxOCA1OTcuNjc0IDI3OS40NzQgNTk0Ljg5NiAyODMuNDM1IDU5Mi4xMTkgMjg3LjM5NiA1ODkuMDQzIDI5My4wMDkgNTg1LjY2OCAzMDAuMjc1TDU4Ni41NDggMzAwLjI3NUM1OTAuNTEzIDMwMC4yNzUgNTkzLjg0NiAyOTguODEgNTk2LjU0NSAyOTUuODgxIDU5Ny44ODIgMjk0LjQyNyA1OTguODIxIDI5Mi41MDYgNTk5LjM2MSAyOTAuMTE1IDU5OS40NTQgMjg5Ljc0IDU5OS41OTUgMjg5LjU1MiA1OTkuNzgzIDI4OS41NTIgNTk5Ljk5NCAyODkuNTUyIDYwMC4wOTkgMjg5LjY3IDYwMC4wOTkgMjg5LjkwNCA2MDAuMDk5IDI5Mi41MjkgNTk4LjY2MiAyOTUuMDA4IDU5NS43ODggMjk3LjM0IDU5Mi45MTMgMjk5LjY3MiA1ODkuODU3IDMwMC44MzggNTg2LjYxOSAzMDAuODM4IDU4Ni4xMjYgMzAwLjgzOCA1ODUuNzE1IDMwMC44MTQgNTg1LjM4NiAzMDAuNzY3IDU4NS4yNDYgMzAxLjA3MiA1ODQuNTQzIDMwMi41MTMgNTgzLjI3NyAzMDUuMDkyIDU4MC4zNDcgMzExLjA2OCA1NzcuODgxIDMxNS4zNDUgNTc1Ljg3NyAzMTcuOTI0IDU3My44NzMgMzIwLjUwMiA1NzEuMjc3IDMyMi43OTkgNTY4LjA5IDMyNC44MTQgNTYzLjAwNCAzMjguMDI1IDU1Ny44MDEgMzI5LjYzMSA1NTIuNDggMzI5LjYzMSA1NDkuNDEgMzI5LjYzMSA1NDYuODkgMzI4LjkzOSA1NDQuOTIyIDMyNy41NTYgNTQyLjk1MyAzMjYuMTc0IDU0MS45NjkgMzI0LjQxNiA1NDEuOTY5IDMyMi4yODMgNTQxLjk2OSAzMjEuMTExIDU0Mi4zMDIgMzIwLjExNSA1NDIuOTcgMzE5LjI5NSA1NDMuNjM4IDMxOC40NzQgNTQ0LjQ1MyAzMTguMDY0IDU0NS40MTQgMzE4LjA2NCA1NDYuOTYxIDMxOC4wNjQgNTQ3LjczNCAzMTguODQ5IDU0Ny43MzQgMzIwLjQyIDU0Ny43MzQgMzIyLjI5NSA1NDYuODkgMzIzLjIzMiA1NDUuMjAzIDMyMy4yMzIgNTQzLjk4NCAzMjMuMjMyIDU0My4zNCAzMjIuNDcgNTQzLjI2OSAzMjAuOTQ3IDU0My4yNjkgMzIwLjg1MyA1NDMuMjQ2IDMyMC43NzEgNTQzLjE5OSAzMjAuNzAxIDU0Mi44MDEgMzIwLjcwMSA1NDIuNjAxIDMyMS4yNjMgNTQyLjYwMSAzMjIuMzg4IDU0Mi42MDEgMzI0LjI0IDU0My41MzMgMzI1Ljc5MyA1NDUuMzk2IDMyNy4wNDcgNTQ3LjI2IDMyOC4zMDEgNTQ5LjU5NyAzMjguOTI3IDU1Mi40MSAzMjguOTI3IDU1OC40MSAzMjguOTI3IDU2My41OSAzMjYuNDc4IDU2Ny45NDkgMzIxLjU4IDU2OS42NiAzMTkuNjU4IDU3MS4zMDEgMzE3LjM0OSA1NzIuODcxIDMxNC42NTQgNTc1LjQyNiAzMTAuMTMxIDU3Ny45OTIgMzA1LjU5NSA1ODAuNTcgMzAxLjA0OUw1ODEuMTMzIDMwMC4wNjRDNTc4Ljc2NSAyOTkuMzM4IDU3Ni44NzkgMjk4LjA1NCA1NzUuNDcyIDI5Ni4yMTUgNTc0LjA2NiAyOTQuMzc1IDU3My4zNjMgMjkyLjI3MSA1NzMuMzYzIDI4OS45MDQgNTczLjM2MyAyODUuNjg1IDU3NS4xMDkgMjgyLjE1OCA1NzguNjAxIDI3OS4zMjIgNTgwLjY2NCAyNzcuNjU4IDU4Mi43NDQgMjc2LjQ5OCA1ODQuODQyIDI3NS44NDIgNTg2LjkzOSAyNzUuMTg1IDU5MC43MTkgMjc0LjUxNyA1OTYuMTc5IDI3My44MzggNTk4LjU3IDI3My41NTYgNjAxLjQyOSAyNzMuMDA2IDYwNC43NTggMjcyLjE4NSA2MDkuMTE3IDI2OS4zOTYgNjEyLjE0IDI2OC4wMDIgNjEzLjgyOCAyNjguMDAyWiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4NCiAgICAgICAgPHRleHQgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwIiBmb250LWZhbWlseT0iQXJpYWwsQXJpYWxfTVNGb250U2VydmljZSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjYxLjYyODkiIHg9IjU0MS45NjkiIHk9IjMyMS45MjciPko8L3RleHQ+DQogICAgPC9nPg0KPC9zdmc+',
];
const SAPPHIRE = 0;
const RUBBY = 1;
const BOMB = 2;
const LOGO = 3;

@Pipe({
  name: 'jemImage',
})
export class JemImagePipe implements PipeTransform {
  transform(value: WordType | Team, ...args: unknown[]): string {
    switch (value) {
      case (WordType.SAPPHIRE, Team.SAPPHIRE):
        return jemImages[SAPPHIRE];
      case (WordType.RUBY, Team.RUBY):
        return jemImages[RUBBY];
      case WordType.BOMB:
        return jemImages[BOMB];
      case WordType.NEUTRAL:
        return '';
      default:
        return jemImages[LOGO];
    }
  }
}
