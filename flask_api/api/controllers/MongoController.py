from pymongo import MongoClient
import certifi
from bson import json_util
import datetime
import json

from api import app

class MongoController:

    def __init__(self) -> None:
        self.client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
        self.db = self.client["DFSDatabase"]
        self.lineups_collection = self.db["lineups"]
        self.db2 = self.client["DFSOwnershipProjections"]
        self.projections_collection = self.db2["projections"]
        self.draftgroups_collection = self.db["draftGroups"]
        self.draftables_collection = self.db["draftables"]
        self.db3 = self.client["Users"]
        self.users_collection = self.db3["users"]

    def getLineupById(self, lineupId, userPublicId):
        lineup = self.lineups_collection.find_one({"lineupId": lineupId, "userPublicId": userPublicId})
        return lineup

    def getUserByUsername(self, username):
        user = self.users_collection.find_one({"username": username})
        return user

    def getUserByPublicId(self, publicId):
        user = self.users_collection.find_one({"public_id": publicId})
        return user

    def createUser(self, data):
        self.users_collection.insert_one(data)

    def createLineup(self, data):	
        self.lineups_collection.insert_one(data)

    def updateLineup(self, data):
        self.lineups_collection.replace_one({"draftGroupId": data["draftGroupId"], "lineupId": data["lineupId"]}, data, upsert=True)

    def getUserLineupsByDraftGroup(self, draftGroupId, userId):
        cursor = self.lineups_collection.find({"draftGroupId": draftGroupId, "userPublicId": userId})
        lineups = [lineup for lineup in cursor]
        return lineups

    def get_user_lineups(self, userPublicId):
        cursor = self.lineups_collection.find({"userPublicId": userPublicId})
        lineups = [lineup for lineup in cursor]
        return lineups

    def batchDeleteLineups(self, userPublicId, lineupIds):
        for lineupId in lineupIds:
            self.lineups_collection.delete_one({ "userPublicId": userPublicId, "lineupId": lineupId })

    def addProjections(self, data):
        projections = {"players": data, "last-update": str(datetime.date.today())}
        self.projections_collection.insert_one(json.loads(json_util.dumps(projections)))

    def addDraftGroups(self, data):
        for draftGroup in data:
            self.draftgroups_collection.replace_one({ "draftGroupId": draftGroup["draftGroupId"] }, draftGroup, upsert=True)        

    def getDraftGroupsAll(self):
        cursor = self.draftgroups_collection.find({})
        draftgroups = sorted([group for group in cursor], key=lambda x: len(x["games"]), reverse=True)
        for draftGroup in draftgroups:
            del(draftGroup["_id"])
        return draftgroups

    def addDraftables(self, data):
        for draftables in data:
            self.draftables_collection.replace_one({ "draftGroupId": draftables["draftGroupId"] }, draftables, upsert=True)        

    def getDraftablesByDraftGroupId(self, draftGroupId):
        draftables = self.draftables_collection.find_one({"draftGroupId": int(draftGroupId)})
        return draftables

    def deleteAllLineups(self):
        self.lineups_collection.delete_many({})

    def deleteAllDraftGroups(self):
        self.draftgroups_collection.delete_many({})

    def deleteAllDraftables(self):
        self.draftables_collection.delete_many({})

    def get_draft_groups_by_time_range(self, start_time, end_time):
        return 

    def get_draft_groups_by_year_and_week(self, year: int, week: int) -> list:
        cursor = self.draftgroups_collection.find({ "week": week, "year": year })
        draft_groups = sorted([group for group in cursor], key=lambda x: len(x["games"]), reverse=True)
        
        for draft_group in draft_groups:
            del(draft_group["_id"])
        return draft_groups

    def add_week_and_year_to_draftGroup_and_draftables(self, draftGroupId, week, year):
        self.draftables_collection.update_one({ "draftGroupId": draftGroupId }, {"$set": {"week": week, "year": year}})
        self.draftgroups_collection.update_one({ "draftGroupId": draftGroupId }, {"$set": {"week": week, "year": year}})
