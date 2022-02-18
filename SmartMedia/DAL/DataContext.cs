using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SmartMedia.Models;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using SmartMedia.Core.Models;


namespace SmartMedia.DAL
{
    
    
    internal class DataContext
    {
        
        //private MongoClient _mgClient = null;
        //private MongoServer _mgServer = null;

        private MongoDatabase _mgDb = null;
        private string _connectionString = string.Empty;
        
        private string _dbName = "SmartMedia";
        
        
        internal DataContext() {
            _connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["Mongo"].ConnectionString;
            var mgClient = new MongoClient(_connectionString);
            var mgServer = mgClient.GetServer();
            _mgDb = mgServer.GetDatabase(_dbName);            
        }

        internal void CreateOrganization(Organization org) {
            _mgDb.GetCollection<Organization>("Organization").Insert(org);
        }

        internal void UpdateOrganization(Organization org) {
            var orgs = _mgDb.GetCollection<Organization>("Organization");
            orgs.Save(org);
        }

        internal Organization GetOrganizationById(string id) {
            var orgs = _mgDb.GetCollection<Organization>("Organization");
            var dOrg = orgs.FindOne(Query.EQ(  "_Id", ObjectId.Parse(id)));

            return dOrg;
        
        }

        internal void DeleteOrganization(string orgId) {
            
            //get users of the given organization
            _mgDb.GetCollection("AspNetUsers").Remove(Query.EQ("OrganizationId", orgId));
            var orgs = _mgDb.GetCollection<Organization>("Organization").Remove(Query.EQ("_id", ObjectId.Parse(orgId)));
            
        }

        internal bool IsApplicationInstalled() {
            var settings = _mgDb.GetCollection<BsonDocument>("ApplicationSettings").FindOne();
            if (settings != null)
            {

                return settings.GetElement("SetupFinished").Value.AsBoolean;
            }
            else
            {
                return false;
            }
        }

        internal void FinishApplicationSetup() {
            //var settings = _mgDb.GetCollection<BsonDocument>("ApplicationSettings").FindOne();
            var doc = new BsonDocument();
            doc.Add("SetupFinished", true);
            _mgDb.GetCollection<BsonDocument>("ApplicationSettings").Insert(doc);
            //_mgDb.GetCollection<BsonDocument>("ApplicationSettings").Update(Query.EQ("SetupFinished", false),
            //    Update.Set("SetupFinished", true));

        }
       
        internal MongoCollection<T> GetDataCollection<T>( string collName) {
            return _mgDb.GetCollection<T>(collName);
        }

        internal string SavePresentation(Presentation prs) {

            string id = string.Empty;
            
            var presentationCollection =  _mgDb.GetCollection<Presentation>("Presentation");
            try
            {
                if (prs.Id.Pid == 0)
                {
                    prs.CreatedDateTime = DateTime.Now;
                    prs.ModifiedDateTime = DateTime.Now;
                    presentationCollection.Insert(prs);
                    
                }
                else
                {
                    var prsDB = presentationCollection.Find(Query.EQ("_id", prs.Id)).Single();
                    prsDB.width = prs.width;
                    prsDB.height = prs.height;
                    prsDB.tickers = prs.tickers;
                    prsDB.currentPageIndex = prs.currentPageIndex;
                    prsDB.pages = prs.pages;
                    prsDB.ModifiedDateTime = DateTime.Now;
                    presentationCollection.Save(prsDB);
                }

                id = prs.Id.ToString();
            }
            catch {
                //return prs;
            }

            return id;
        }


        internal ICollection<PresentationQuery> GetPresentations(string userId)
        {
            var presentations = _mgDb.GetCollection<Presentation>("Presentation").Find(Query.EQ("userId", userId)).Select(p =>
                    new PresentationQuery { 
                        ID = p.Id.ToString(),
                        Name = p.name,
                        CreatedDate = p.CreatedDateTime.ToString("dd-MM-yyyy hh:mm:ss"),
                        ModifiedDate = p.ModifiedDateTime.ToString("dd-MM-yyyy hh:mm:ss")
                    }
                ).ToList();

            return presentations;;
        }

        internal Presentation GetPresentation(string id)
        {
            var presentation = _mgDb.GetCollection<Presentation>("Presentation").FindOne(Query.EQ("_id", ObjectId.Parse(id)));

            return presentation;
        }
    }
}