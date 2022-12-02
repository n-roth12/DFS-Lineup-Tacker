import requests

class YahooController:

    def __init__(self):
        self.none = ""

    def getYahooContestPlayersByContestId(self, contestId: int):
        try:
            draftables = requests.get('https://dfyql-ro.sports.yahoo.com/v2/contestPlayers?lang=en-US&region=US&device=desktop&contestId=11776777').json()
            result = {}
            result["site"] = "yahoo"
            result["draftGroupId"] = contestId
            result["players"] = draftables["players"]["result"]

            return result

        except Exception as e:
            print("Error fetching yahoo players")
            print(e)
            return 

    def getYahooUpcomingContestIds(self):
        try:
            series_ids = set()
            result = []
            res = requests.get('https://dfyql-ro.sports.yahoo.com/v2/contestsFilteredWeb?lang=en-US&region=US&device=desktop&sport=nfl&entryFeeMin=0&entryFeeMax=10500&sortAsc=false&slateTypes=SINGLE_GAME&slateTypes=MULTI_GAME')
            for contest in res.json()['contests']['result']:
                if contest["seriesId"] not in series_ids:
                    series_ids.add(contest["seriesId"])
                    result.append(contest)
            return result
        except Exception as e:
            print("Error fetching yahoo contests")
            print(e)
            return

    def getYahooDraftablesByContestId(self, contestId):
        try:
            res = requests.get(f'https://dfyql-ro.sports.yahoo.com/v2/contestPlayers?lang=en-US&region=US&device=desktop&contestId={contestId}').json()
            return res["players"]["result"]
        except Exception as e:
            print("Error retrieving yahoo players for contest")
            print(e)
            return 

    def getYahooUpcomingSeries(self):
        try:
            res = requests.get('https://dfyql-ro.sports.yahoo.com/v2/contestSeries?lang=en-US&region=US&device=desktop&sport=nfl&entryFeeMin=0&entryFeeMax=10500&sortAsc=false&slateTypes=SINGLE_GAME&slateTypes=MULTI_GAME').json()
            nfl_games = {}
            games_dict = res["games"]["result"]
            for key in games_dict.keys():
                if key.startswith("nfl"):
                    nfl_games[key] = games_dict[key]["game"]
            
            data = [x for x in res["sports"]["result"] if x["sportCode"] == "nfl"]
            series = data[0]["series"]
            
            for serie in series:
                games = []
                for game_code in serie["gameCodeList"]:
                    games.append(nfl_games[game_code])

                serie["games"] = games
                serie["draftGroupId"] = serie["series"]["id"]
                serie["site"] = "yahoo"
                serie["salaryCap"] = serie["series"]["salaryCapOverride"] if serie["series"]["salaryCapOverride"] != None else 200
                serie["startTimeSuffix"] = "Main" if serie["series"]["mainSeries"] == True else serie["series"]["seriesType"]
                del(serie["gameCodeList"])
        
            return series
		
        except Exception as e:
            print("Error retrieving yahoo series")
            print(e)
            return


    def convertYahooPlayer(self, player):
        player["teamAbbreviation"] = player.pop("teamAbbr", "")
        player["position"] = player.pop("primaryPosition", "")
        player["fppg"] = player.pop("fantasyPointsPerGame", "")
        player["displayName"] = f'{player["firstName"]} {player["lastName"]}'
        player["oprk"] = plae

        # if player["draftStatAttributes"]:
        #     fppg = [x["value"] for x in player["draftStatAttributes"] if x["id"] == 90]
        #     oprk = [x["value"] for x in player["draftStatAttributes"] if x["id"] == -2]
            
        #     player["fppg"] = fppg[0] if len(fppg) else None
        #     player["oprk"] = oprk[0] if len(oprk) else None

        # if player["game"]:
        #     player["game"] = {
        #         "homeTeam": player["competition"]["nameDisplay"][0]["value"],
        #         "awayTeam": player["competition"]["nameDisplay"][2]["value"],
        #         "competitionId": player["competition"]["competitionId"],
        #         "startTime": player["competition"]["startTime"]
        #     }
        
        # player["team"] = player["teamAbbreviation"]
        # player["site"] = "draftkings"

        # del(player["teamAbbreviation"])
        # del(player["competition"])
        # del(player["draftStatAttributes"])
        # del(player["rosterSlotId"])
        # del(player["isSwappable"])
        # del(player["teamLeagueSeasonAttributes"])
        # del(player["externalRequirements"])



    def convertYahooDraftGroup(self, draftGroup):